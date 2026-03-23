import { Injectable, Inject, ConflictException, UnauthorizedException } from '@nestjs/common';
import { DRIZZLE } from '../db/db.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { REDIS_CLIENT } from '../redis/redis.module';
import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';

const REFRESH_TTL = 60 * 60 * 24 * 7; // 7일 (초)

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>,
    @Inject(REDIS_CLIENT) private redis: Redis,
    private jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const existing = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, dto.email))
      .execute();

    if (existing.length > 0) {
      throw new ConflictException('이미 가입된 이메일입니다.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const [newUser] = await this.db
      .insert(schema.users)
      .values({
        email: dto.email,
        password: hashedPassword,
        nickname: dto.nickname,
      })
      .returning()
      .execute();

    return {
      message: '회원가입이 완료되었습니다.',
      user: {
        id: newUser.id,
        email: newUser.email,
        nickname: newUser.nickname,
      },
    };
  }

  async login(dto: LoginDto) {
    const [user] = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, dto.email))
      .execute();

    if (!user) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);

    // Refresh Token 생성 및 Redis 저장
    const refreshToken = uuidv4();
    await this.redis.set(`refresh:${user.id}`, refreshToken, 'EX', REFRESH_TTL);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
      },
    };
  }

  async refresh(userId: number, refreshToken: string) {
    const stored = await this.redis.get(`refresh:${userId}`);
    if (!stored || stored !== refreshToken) {
      throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다.');
    }

    const [user] = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, userId))
      .execute();

    if (!user) {
      throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
    }

    const payload = { sub: user.id, email: user.email };
    const newAccessToken = await this.jwtService.signAsync(payload);

    // Refresh Token 갱신 (TTL 리셋)
    const newRefreshToken = uuidv4();
    await this.redis.set(`refresh:${user.id}`, newRefreshToken, 'EX', REFRESH_TTL);

    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
    };
  }

  async logout(userId: number) {
    await this.redis.del(`refresh:${userId}`);
    return { message: '로그아웃 되었습니다.' };
  }

  async getUsers() {
    const rows = await this.db
      .select({
        id: schema.users.id,
        email: schema.users.email,
        nickname: schema.users.nickname,
        createdAt: schema.users.createdAt,
      })
      .from(schema.users)
      .execute();
    return rows;
  }
}
