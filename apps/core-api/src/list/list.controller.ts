import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, UseGuards } from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { CurrentUser } from 'apps/core-api/src/auth/utils/current-user.decorator';
import { Users } from 'apps/core-api/src/users/entities/users.entity';
import { JwtAuthGuard } from 'apps/core-api/src/auth/guards/jwt-auth.guard';
import { ListService } from './list.service';
import { UpdateListDto } from './dto/update-list.dto';

@Controller('lists')
export class ListController {
    constructor(
        private readonly listService: ListService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() list: CreateListDto, @CurrentUser() user: Users) {
        return this.listService.create(list, user);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getLists(@CurrentUser() user: Users) {
        return this.listService.getLists(user);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneList(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: Users) {
        return this.listService.getOneList(id, user);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':listId/movies/:movieId')
    async addMovie(
        @Param('listId', ParseUUIDPipe) listId: string,
        @Param('movieId', ParseUUIDPipe) movieId: string,
        @CurrentUser() user: Users
        ) {
        return this.listService.addMovie(listId, movieId, user);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':listId')
    async editList(@Param('listId', ParseUUIDPipe) listId: string,@Body() updateListDto: UpdateListDto, @CurrentUser() user: Users) {
        return this.listService.editList(listId, updateListDto, user);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':listId/movies/:movieId')
    async removeMovie(@Param('listId', ParseUUIDPipe) listId: string, @Param('movieId', ParseUUIDPipe) movieId: string, @CurrentUser() user: Users) {
        return this.listService.removeMovie(listId, movieId, user);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteList(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: Users) {
        return this.listService.deleteList(id, user);
    }
}
