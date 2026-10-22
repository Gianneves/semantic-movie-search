import { Body, Controller, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { CreateFriendDto } from './dto/create-friends.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Users } from '../users/entities/users.entity';
import { CurrentUser } from '../auth/utils/current-user.decorator';

@Controller('friends')
export class FriendsController {
    constructor(
        private readonly friendsService: FriendsService,
    ){}

    @Post()
    @UseGuards(JwtAuthGuard)
    inviteFriend(@Body() createFriendDto: CreateFriendDto, @CurrentUser() user: Users) {
        return this.friendsService.inviteFriend(createFriendDto, user);
    }
}
