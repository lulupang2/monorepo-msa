"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const db_module_1 = require("../db/db.module");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const schema = __importStar(require("../db/schema"));
const drizzle_orm_1 = require("drizzle-orm");
const bcrypt = __importStar(require("bcrypt"));
const jwt_1 = require("@nestjs/jwt");
const redis_module_1 = require("../redis/redis.module");
const ioredis_1 = __importDefault(require("ioredis"));
const uuid_1 = require("uuid");
const REFRESH_TTL = 60 * 60 * 24 * 7;
let AuthService = class AuthService {
    db;
    redis;
    jwtService;
    constructor(db, redis, jwtService) {
        this.db = db;
        this.redis = redis;
        this.jwtService = jwtService;
    }
    async signup(dto) {
        const existing = await this.db
            .select()
            .from(schema.users)
            .where((0, drizzle_orm_1.eq)(schema.users.email, dto.email))
            .execute();
        if (existing.length > 0) {
            throw new common_1.ConflictException('이미 가입된 이메일입니다.');
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
    async login(dto) {
        const [user] = await this.db
            .select()
            .from(schema.users)
            .where((0, drizzle_orm_1.eq)(schema.users.email, dto.email))
            .execute();
        if (!user) {
            throw new common_1.UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
        }
        const isMatch = await bcrypt.compare(dto.password, user.password);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
        }
        const payload = { sub: user.id, email: user.email };
        const accessToken = await this.jwtService.signAsync(payload);
        const refreshToken = (0, uuid_1.v4)();
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
    async refresh(userId, refreshToken) {
        const stored = await this.redis.get(`refresh:${userId}`);
        if (!stored || stored !== refreshToken) {
            throw new common_1.UnauthorizedException('유효하지 않은 리프레시 토큰입니다.');
        }
        const [user] = await this.db
            .select()
            .from(schema.users)
            .where((0, drizzle_orm_1.eq)(schema.users.id, userId))
            .execute();
        if (!user) {
            throw new common_1.UnauthorizedException('사용자를 찾을 수 없습니다.');
        }
        const payload = { sub: user.id, email: user.email };
        const newAccessToken = await this.jwtService.signAsync(payload);
        const newRefreshToken = (0, uuid_1.v4)();
        await this.redis.set(`refresh:${user.id}`, newRefreshToken, 'EX', REFRESH_TTL);
        return {
            access_token: newAccessToken,
            refresh_token: newRefreshToken,
        };
    }
    async logout(userId) {
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(db_module_1.DRIZZLE)),
    __param(1, (0, common_1.Inject)(redis_module_1.REDIS_CLIENT)),
    __metadata("design:paramtypes", [node_postgres_1.NodePgDatabase,
        ioredis_1.default,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map