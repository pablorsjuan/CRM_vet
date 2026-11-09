import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';

import { MAIL_TRANSPORTER } from './mail.constants';
import { MailService } from './mail.service';

/**
 * Módulo compartido de notificaciones. Hoy envía correos con Nodemailer;
 * aquí también se podrán agregar los observadores de eventos (citas
 * confirmadas, canceladas, recordatorios).
 *
 * Las credenciales SMTP se leen SIEMPRE del archivo .env (RNF-007).
 */
@Module({
  providers: [
    {
      provide: MAIL_TRANSPORTER,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        createTransport({
          host: config.getOrThrow<string>('MAIL_HOST'),
          port: Number(config.getOrThrow<string>('MAIL_PORT')),
          // true solo para el puerto 465; en el 587 la conexión se cifra con STARTTLS.
          secure: config.get<string>('MAIL_SECURE') === 'true',
          auth: {
            user: config.getOrThrow<string>('MAIL_USER'),
            pass: config.getOrThrow<string>('MAIL_PASSWORD'),
          },
          // Evita que un SMTP lento deje la petición colgada (RNF-008).
          connectionTimeout: 10_000,
          greetingTimeout: 10_000,
          socketTimeout: 15_000,
        }),
    },
    MailService,
  ],
  exports: [MailService],
})
export class NotificationsModule {}
