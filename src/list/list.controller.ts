import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { CurrentUser } from 'src/auth/utils/current-user.decorator';
import { Users } from 'src/users/entities/users.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ListService } from './list.service';

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
    @Post(':listId/movies/:movieId')
    async addMovie(
        @Param('listId', ParseUUIDPipe) listId: string,
        @Param('movieId', ParseUUIDPipe) movieId: string,
        @CurrentUser() user: Users
        ) {
        return this.listService.addMovie(listId, movieId, user);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':listId/movies/:movieId')
    async removeMovie(@Param('listId', ParseUUIDPipe) listId: string, @Param('movieId', ParseUUIDPipe) movieId: string, @CurrentUser() user: Users) {
        return this.listService.removeMovie(listId, movieId, user);
    }
}
