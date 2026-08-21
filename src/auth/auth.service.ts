import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import ms from 'ms';
import { UsersService } from 'src/users/users.service';
import { TokenPayload } from './utils/token-payload.interface';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Response } from 'express';
import { Repository } from 'typeorm';
import { Users } from 'src/users/entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Users)
        private readonly userRepository: Repository<Users>,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService
    ) { }

    async login(user: Users, response: Response) {
        const jwtExpiration = this.configService.getOrThrow<string>('JWT_EXPIRATION') || '1h';

        const expires = new Date();

        expires.setMilliseconds(
            expires.getMilliseconds() +
            ms(jwtExpiration as unknown as ms.StringValue)
        );

        const tokenPayload: TokenPayload = {
            userId: user.id
        }

        const token = this.jwtService.sign(tokenPayload);

        response.cookie('Authentication', token, {
            secure: true,
            httpOnly: true,
            expires
        });

        return { tokenPayload }
    }

    async verifyUser(email: string, password: string) {
        try {
            const user = await this.userRepository.findOneBy({
                email
            });

            if (!user) {
                throw new Error('Usuário não encontrado');
            }

            const auth = await bcrypt.compare(password, user.password);

            if (!auth) {
                throw new UnauthorizedException();
            }

            return user;
        } catch (error: any) {
            throw new UnauthorizedException('Credenciais não são válidas.')
        }
    }
}
