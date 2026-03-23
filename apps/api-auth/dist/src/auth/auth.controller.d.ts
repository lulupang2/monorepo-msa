import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    refresh(body: {
        userId: number;
        refreshToken: string;
    }): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    logout(body: {
        userId: number;
    }): Promise<{
        message: string;
    }>;
    getUsers(): Promise<{
        id: number;
        email: string;
        nickname: string | null;
        createdAt: Date;
    }[]>;
}
