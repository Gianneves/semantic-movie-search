import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Users } from './entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import type { TokenPayload } from 'src/auth/utils/token-payload.interface';
import * as path from 'path'
import * as fs from 'fs/promises'

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users)
        private readonly usersRepository: Repository<Users>
    ) { }

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

    async update(id: string, updateUser: UpdateUserDto, tokenPayload: TokenPayload) {

        const personData = {
            name: updateUser.name
        }


        if (updateUser?.password) {
            const passHash = await bcrypt.hash(updateUser.password, 10);

            personData['password'] = passHash;
        }

        const person = await this.usersRepository.preload({
            id,
            ...personData
        });


        if (!person) {
            throw new NotFoundException('Usuário não encontrado');
        }

        if (person.id !== tokenPayload.userId) {
            throw new ForbiddenException('Você não tem permissão para editar esse profile.');
        }

        return this.usersRepository.save(person);
    }

    async uploadPicture(file: Express.Multer.File, tokenPayload: TokenPayload) {
        if (file.size < 1024) {
            throw new BadRequestException('Arquivo muito grande');
        }

        const user = await this.usersRepository.findOneBy({
            id: tokenPayload.userId
        });

        if (!user) {
            throw new Error('Usuário não encontrado.');
        }

        const fileExtension =
            path.extname(file.originalname)
                .toLowerCase()
                .substring(1);

        const fileName = `${tokenPayload.userId}.${fileExtension}`;
        const fileFullPath = path.resolve(process.cwd(), 'avatars', fileName);

        await fs.writeFile(fileFullPath, file.buffer);

        user.avatar = fileName;

        await this.usersRepository.save(user);
        return user;
    }
}
