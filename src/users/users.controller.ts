import { Body, Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/utils/current-user.decorator';
import { Users } from './entities/users.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import type { TokenPayload } from 'src/auth/utils/token-payload.interface';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) {}

    @Post()
    create(@Body() createUser: CreateUserDto) {
        return this.usersService.create(createUser);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUser: UpdateUserDto, @CurrentUser() tokenPayload: TokenPayload) {
        return this.usersService.update(id, updateUser, tokenPayload);
    }
}
