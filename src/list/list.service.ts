import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { Repository } from 'typeorm';
import { List } from './entities/list.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/users.entity';

@Injectable()
export class ListService {
    constructor(
        @InjectRepository(List)
        private readonly listRepository: Repository<List>,
        
    ) { }

    async create(createList: CreateListDto, user: Users) {
        const list = this.listRepository.create({
            ...createList,
            owner: user
        });

        return await this.listRepository.save(list);
    }

    async getLists(user: Users) {
        const list = await this.listRepository.find({
            relations: {
                owner: true,
                members: true,
                movie: true,
            },
            select: {
                id: true,
                title: true,
                owner: {
                    id: true,
                    name: true,
                },
                movie: {
                    id: true,
                    original_title: true,
                    cover: true,
                }
            },

            where: [
                {
                    owner: {
                        id: user.id
                    }
                },
            ]
        });

        return list;
    }

    async addMovie(listId: string, movieId: string, user: Users) {

        const list = await this.listRepository.findOne({
            where: { id: listId},
            relations: ['owner']
        });

        if (!list) {
            throw new NotFoundException('Lista não encontrada');
        }

        if (list.owner.id !== user.id) {
            throw new ForbiddenException('Você não tem permissão para alterar esta lista');
        }

        try {
            await this.listRepository
                .createQueryBuilder()
                .relation(List, 'movie')
                .of(listId)   
                .add(movieId); 

            return { message: 'Filme adicionado com sucesso' };
        } catch (error: any) {
          
            if (error.code === '23503') { 
                throw new NotFoundException('Filme não encontrado');
            }
            if (error.code === '23505') {
                throw new BadRequestException('Este filme já está na lista');
            }
            throw error;
        }
    }

    async removeMovie(listId: string, movieId: string) {
          try {
            await this.listRepository
                .createQueryBuilder()
                .relation(List, 'movie')
                .of(listId)   
                .remove(movieId); 

            return { message: 'Filme removido com sucesso' };
        } catch (error: any) {
          throw new InternalServerErrorException('Erro ao remover o filme da lista');
        }
    }
}
