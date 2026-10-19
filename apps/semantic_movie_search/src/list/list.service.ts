import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { Repository } from 'typeorm';
import { List } from './entities/list.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'apps/semantic_movie_search/src/users/entities/users.entity';
import { UpdateListDto } from './dto/update-list.dto';

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
                movies: true,
            },
            select: {
                id: true,
                title: true,
                owner: {
                    id: true,
                    name: true,
                },
                movies: {
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

    async getOneList(id: string, user: Users) {
        const list = await this.listRepository.find({
            relations: {
                owner: true,
                members: true,
                movies: true,
            },
            select: {
                id: true,
                title: true,
                owner: {
                    id: true,
                    name: true,
                },
                movies: {
                    id: true,
                    original_title: true,
                    cover: true,
                }
            },

            where: [
                {
                    id
                }
            ]
        });

        if (!list) {
            throw new NotFoundException('Lista não encontrada');
        }

        if (list[0].owner.id !== user.id) {
            throw new ForbiddenException('Você não tem permissão para alterar esta lista');
        }

        return list;
    }

    async addMovie(listId: string, movieId: string, user: Users) {

        const list = await this.listRepository.findOne({
            where: { id: listId },
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
                .relation(List, 'movies')
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

    async editList(listId: string, updateListDto: UpdateListDto, user: Users) {
        const list = await this.listRepository.findOne({
            where: { id: listId },
            relations: ['owner']
        });

        if (!list) {
            throw new NotFoundException('Lista não encontrada');
        }

        if (list.owner.id !== user.id) {
            throw new ForbiddenException('Você não tem permissão para alterar esta lista');
        }

        try {
            list.title = updateListDto.title ?? list.title;

            await this.listRepository.save(list);

            return { message: 'Filme editado com sucesso' };
        } catch (error: any) {
            throw new InternalServerErrorException('Erro ao editar o filme');
        }

    }

    async removeMovie(listId: string, movieId: string, user: Users) {
        const list = await this.listRepository.findOne({
            where: { id: listId },
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
                .relation(List, 'movies')
                .of(listId)
                .remove(movieId);

            return { message: 'Filme removido com sucesso' };
        } catch (error: any) {
            throw new InternalServerErrorException('Erro ao remover o filme da lista');
        }
    }

    async deleteList(id: string, user: Users) {
        const list = await this.listRepository.findOne({
            where: { id },
            relations: ['owner']
        });

        if (!list) {
            throw new NotFoundException('Lista não encontrada');
        }

        if (list.owner.id !== user.id) {
            throw new ForbiddenException('Você não tem permissão para deletar esta lista');
        }

        return await this.listRepository.delete(id);
    }
}
