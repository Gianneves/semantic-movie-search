import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService implements OnModuleInit {
  private readonly logger = new Logger(EmailService.name);
  private transporter!: nodemailer.Transporter;
  private from!: string;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const host = this.configService.get<string>('EMAIL_HOST');
    const port = this.parseInt(
      this.configService.get<string>('EMAIL_PORT'),
      587,
    );
    const user = this.configService.get<string>('EMAIL_USER');
    const pass = this.configService.get<string>('EMAIL_PASSWORD');
    const from = this.configService.get<string>('EMAIL_FROM');

    if (!host || !user || !pass || !from) {
      throw new Error(
        'Configuração de e-mail incompleta. Verifique EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD e EMAIL_FROM no arquivo .env',
      );
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });

    this.from = from;

    void this.verifyConnection();
  }

  private async verifyConnection() {
    try {
      await this.transporter.verify();
      this.logger.log(
        `Transporte SMTP pronto: ${this.configService.get('EMAIL_HOST')}:${this.configService.get('EMAIL_PORT')}`,
      );
    } catch (error) {
      this.logger.error(
        `Falha ao conectar no servidor SMTP: ${this.errorMessage(error)}`,
      );
    }
  }

  async sendEmail(to: string, subject: string, content: string) {
    const mailOptions = {
      from: this.formatFrom(this.from),
      to,
      subject,
      text: content,
    };

    const info = await this.transporter.sendMail(mailOptions);

    this.logger.log(`E-mail enviado para ${to} (messageId: ${info.messageId})`);

    return info;
  }

  private parseInt(value: string | undefined, fallback: number): number {
    const parsed = Number.parseInt(value ?? '', 10);
    return Number.isNaN(parsed) ? fallback : parsed;
  }

  private formatFrom(from: string): string {
    return from.includes('<') ? from : `"No Reply" <${from}>`;
  }

  private errorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return String(error);
  }
}
