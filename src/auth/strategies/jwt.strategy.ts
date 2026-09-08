import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { TokenPayload } from "../utils/token-payload.interface";
import { Users } from "src/users/entities/users.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(Users)
        private readonly usersRepository: Repository<Users>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => request.cookies.Authentication
            ]),
            secretOrKey: configService.getOrThrow('JWT_SECRET')
        });
    }

    async validate(payload: { userId: string }) {
        const user = await this.usersRepository.findOne({
            where: { id: payload.userId },
        });

        if (!user) {
            throw new UnauthorizedException();
        }

        const { password, ...safeUser } = user;
        return safeUser;
    }
}