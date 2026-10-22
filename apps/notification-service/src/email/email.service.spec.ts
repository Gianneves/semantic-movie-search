import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';

describe('EmailService', () => {
  let service: EmailService;

  const emailConfig: Record<string, string> = {
    EMAIL_HOST: 'smtp.example.com',
    EMAIL_PORT: '587',
    EMAIL_USER: 'user',
    EMAIL_PASSWORD: 'password',
    EMAIL_FROM: 'no-reply@example.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) => emailConfig[key],
          },
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('deve lançar na inicialização quando a configuração de e-mail está incompleta', () => {
    const incompleteService = new EmailService({
      get: () => undefined,
    } as unknown as ConfigService);

    expect(() => incompleteService.onModuleInit()).toThrow(
      /Configuração de e-mail incompleta/,
    );
  });

  it('envia com o display name padrão quando EMAIL_FROM é apenas o endereço', async () => {
    const sendMail = jest.fn().mockResolvedValue({ messageId: 'id-1' });
    (service as any).transporter = { sendMail };
    (service as any).from = emailConfig.EMAIL_FROM;

    await service.sendEmail('dest@example.com', 'Assunto', 'Corpo');

    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: '"No Reply" <no-reply@example.com>',
        to: 'dest@example.com',
      }),
    );
  });

  it('preserva o display name quando EMAIL_FROM já contém um nome', async () => {
    const sendMail = jest.fn().mockResolvedValue({ messageId: 'id-2' });
    (service as any).transporter = { sendMail };

    const configWithName: Record<string, string> = {
      ...emailConfig,
      EMAIL_FROM: 'Semantic Movie Search <no-reply@example.com>',
    };
    const serviceWithName = new EmailService({
      get: (key: string) => configWithName[key],
    } as unknown as ConfigService);
    (serviceWithName as any).transporter = { sendMail };
    (serviceWithName as any).from = configWithName.EMAIL_FROM;

    await serviceWithName.sendEmail('dest@example.com', 'Assunto', 'Corpo');

    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 'Semantic Movie Search <no-reply@example.com>',
      }),
    );
  });
});
