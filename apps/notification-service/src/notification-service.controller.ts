import { Controller, Logger } from '@nestjs/common';
import { NotificationServiceService } from './notification-service.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { RabbitDataDto } from './dto/rabbit-data.dto';

@Controller()
export class NotificationServiceController {
  private readonly logger = new Logger(NotificationServiceController.name);
  constructor(
    private readonly notificationServiceService: NotificationServiceService,
  ) {}

  @EventPattern('invite-friend')
  async inviteFriendEmail(@Payload() data: RabbitDataDto) {
    this.logger.log(
      `📬 Mensagem recebida no RabbitMQ: ${JSON.stringify(data)}`,
    );
    await this.notificationServiceService.handleAddFriend(data);
  }
}
