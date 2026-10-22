import { Injectable, Logger } from '@nestjs/common';
import { RabbitDataDto } from './dto/rabbit-data.dto';
import { EmailService } from './email/email.service';

@Injectable()
export class NotificationServiceService {
  private readonly logger = new Logger(NotificationServiceService.name);

  constructor(private readonly emailService: EmailService) {}

  async handleAddFriend(data: RabbitDataDto) {
    const subject = `Convite de amizade de - ${data.requesterName}`;

    const text = `Olá ${data.addresseeName} - Você recebeu um convite de amizade do user ${data.requesterName}`;

    try {
      await this.emailService.sendEmail(data.addresseeEmail, subject, text);

      this.logger.log(
        `Convite de amizade processado para ${data.addresseeEmail}`,
      );
    } catch (error) {
      this.logger.error(
        `Falha ao enviar o e-mail de convite para ${data.addresseeEmail}: ${this.errorMessage(error)}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  private errorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return String(error);
  }
}
