import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../db/schema';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import Redis from 'ioredis';
export declare class AuthService {
    private db;
    private redis;
    private jwtService;
    constructor(db: NodePgDatabase<typeof schema>, redis: Redis, jwtService: JwtService);
    signup(dto: SignupDto): Promise<{
        message: string;
        user: {
            id: number;
            email: string;
            nickname: string | null;
        };
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
            id: number;
            email: string;
            nickname: string | null;
        };
    }>;
    refresh(userId: number, refreshToken: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    logout(userId: number): Promise<{
        message: string;
    }>;
    getUsers(): Promise<{
        id: number;
        email: string;
        nickname: string | null;
        createdAt: Date;
    }[]>;
}
