import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { formatearFechaHora } from '../../common/utils/date.util';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly configService: ConfigService) {}

  // Método principal para enviar correos
  async enviarCorreo(
    destinatario: string,
    asunto: string,
    mensaje: string,
  ): Promise<void> {
    const host = this.configService.get<string>('SMTP_HOST');
    const port = Number(
      this.configService.get<string>('SMTP_PORT') || 587,
    );
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
      auth: {
        user,
        pass,
      },
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

  // Notificación cuando se agenda una cita
  async notificarCitaAgendada(
    correo: string,
    nombreCliente: string,
    nombreMascota: string,
    fechaCita: Date | string,
  ): Promise<void> {
    const asunto = 'Confirmación de cita - CRM Veterinario';

    const mensaje = `Hola ${nombreCliente},

Tu cita veterinaria para ${nombreMascota} ha sido agendada correctamente.

Fecha y hora: ${formatearFechaHora(fechaCita)}

¡Te esperamos!

CRM Veterinario`;

    await this.enviarCorreo(correo, asunto, mensaje);
  }

  // Notificación cuando se cancela una cita
  async notificarCitaCancelada(
    correo: string,
    nombreCliente: string,
    nombreMascota: string,
    fechaCita: Date | string,
  ): Promise<void> {
    const asunto = 'Cancelación de cita - CRM Veterinario';

    const mensaje = `Hola ${nombreCliente},

Te informamos que la cita veterinaria de ${nombreMascota} ha sido cancelada.

Fecha de la cita cancelada: ${formatearFechaHora(fechaCita)}

Si necesitas una nueva cita, puedes comunicarte con nosotros.

CRM Veterinario`;

    await this.enviarCorreo(correo, asunto, mensaje);
  }

  // Recordatorio para una cita próxima
  async enviarRecordatorioCita(
    correo: string,
    nombreCliente: string,
    nombreMascota: string,
    fechaCita: Date | string,
  ): Promise<void> {
    const asunto = 'Recordatorio de cita - CRM Veterinario';

    const mensaje = `Hola ${nombreCliente},

Te recordamos que ${nombreMascota} tiene una cita veterinaria programada.

Fecha y hora: ${formatearFechaHora(fechaCita)}

Este recordatorio corresponde a los 30 minutos previos a la cita.

¡Te esperamos!

CRM Veterinario`;

    await this.enviarCorreo(correo, asunto, mensaje);
  }
}
