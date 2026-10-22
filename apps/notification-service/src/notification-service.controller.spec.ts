import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { NotificationServiceController } from './notification-service.controller';
import { NotificationServiceService } from './notification-service.service';
import { EmailService } from './email/email.service';

describe('NotificationServiceController', () => {
  let notificationServiceController: NotificationServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [NotificationServiceController],
      providers: [
        NotificationServiceService,
        {
          provide: EmailService,
          useValue: {
            sendEmail: () => Promise.resolve({ messageId: 'test-message-id' }),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: () => undefined,
          },
        },
      ],
    }).compile();

    notificationServiceController = app.get<NotificationServiceController>(
      NotificationServiceController,
    );
  });

  describe('inviteFriendEmail', () => {
    it('deve estar definido', () => {
      expect(notificationServiceController).toBeDefined();
    });
  });
});
