import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateFriendDto } from './dto/create-friends.dto';
import { NOTIFICATION_CLIENT } from '../constants';
import { ClientProxy } from '@nestjs/microservices';
import { Users } from '../users/entities/users.entity';
import { Repository } from 'typeorm';
import { Friends } from './entities/friends.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendshipStatus } from './utils/friendship';

@Injectable()
export class FriendsService {
  private readonly logger = new Logger(FriendsService.name);

  constructor(
    @Inject(NOTIFICATION_CLIENT)
    private readonly client: ClientProxy,
    @InjectRepository(Friends)
    private readonly friendsRepository: Repository<Friends>,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}
  async inviteFriend(createFriendDto: CreateFriendDto, user: Users) {
    try {
      const friend = await this.userRepository.findOneBy({
        id: createFriendDto.friendId,
      });

      if (!friend) {
        throw new NotFoundException('Usuário não encontrado');
      }

      const invite = this.friendsRepository.create({
        requester: user,
        addressee: friend,
        status: FriendshipStatus.PENDING,
      });

      const toSend = {
        requesterId: user.id,
        requesterName: user.name,
        addresseeId: friend.id,
        addresseeName: friend.name,
        addresseeEmail: friend.email,
      };

      this.emitInviteFriend(toSend);

      return await this.friendsRepository.save(invite);
    } catch (error) {
      this.logger.error(
        `Falha ao processar o convite de amizade: ${this.errorMessage(error)}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  private emitInviteFriend(payload: {
    requesterId: string;
    requesterName: string;
    addresseeId: string;
    addresseeName: string;
    addresseeEmail: string;
  }) {
    this.client.emit('invite-friend', payload).subscribe({
      next: () =>
        this.logger.log(
          `Convite de amizade publicado no RabbitMQ para ${payload.addresseeEmail}`,
        ),
      error: (error) =>
        this.logger.error(
          `Não foi possível publicar o evento "invite-friend" no RabbitMQ: ${this.errorMessage(error)}`,
        ),
    });
  }

  private errorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return String(error);
  }
}
