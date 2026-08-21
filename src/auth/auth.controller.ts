import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { CurrentUser } from './utils/current-user.decorator';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Users } from 'src/users/entities/users.entity';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(
        @CurrentUser() user: Users,
        @Res({ passthrough: true }) response: Response
    ) {
        return this.authService.login(user, response);
    }
}
