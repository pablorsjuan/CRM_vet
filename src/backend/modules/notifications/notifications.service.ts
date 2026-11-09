
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly configService: ConfigService) {}

  async enviarCorreo(
    destinatario: string,
    asunto: string,
    mensaje: string,
  ): Promise<void> {
    const host = this.configService.get<string>('SMTP_HOST');
    const port = Number(this.configService.get<string>('SMTP_PORT') || 587);
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');

    if (!host || !user || !pass) {
      throw new InternalServerErrorException(
        'La configuración SMTP está incompleta',
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    try {
      await transporter.sendMail({
        from: this.configService.get<string>('SMTP_FROM') || user,
        to: destinatario,
        subject: asunto,
        text: mensaje,
      });

      this.logger.log('Correo enviado correctamente');
    } catch (error) {
      this.logger.error('No se pudo enviar el correo', error);
      throw new InternalServerErrorException(
        'No se pudo enviar la notificación por correo',
      );
    }
  }
}
