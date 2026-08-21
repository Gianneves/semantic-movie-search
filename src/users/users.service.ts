import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Users } from './entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users)
        private readonly usersRepository: Repository<Users>
    ) {}

    async create(createUser: CreateUserDto) {
        try {
            const user = this.usersRepository.create({
                ...createUser,
                password: await bcrypt.hash(createUser.password, 10),
            });

            await this.usersRepository.save(user);

            return user;
        } catch (error: any) {

            if (error.code === '23505') {
                throw new UnprocessableEntityException('E-mail já cadastrado.');
            }

            throw new Error(error);
        }
    }
}
