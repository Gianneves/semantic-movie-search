import { Body, Controller, FileTypeValidator, MaxFileSizeValidator, Param, ParseFilePipe, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/utils/current-user.decorator';
import { Users } from './entities/users.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import type { TokenPayload } from 'src/auth/utils/token-payload.interface';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) { }

    @Post()
    create(@Body() createUser: CreateUserDto) {
        return this.usersService.create(createUser);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUser: UpdateUserDto, @CurrentUser() tokenPayload: TokenPayload) {
        return this.usersService.update(id, updateUser, tokenPayload);
    }

    @UseGuards(JwtAuthGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    uploadPicture(@UploadedFile(
        new ParseFilePipe({
            validators: [
                new MaxFileSizeValidator({ maxSize: 10 * (1024 * 1024) }),
                new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' })
            ]
        })
    ) file: Express.Multer.File, @CurrentUser() tokenPayload: TokenPayload) {
        return this.usersService.uploadPicture(file, tokenPayload)
    }
}
