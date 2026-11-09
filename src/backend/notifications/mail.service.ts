import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Transporter } from 'nodemailer';

import { MAIL_TRANSPORTER } from './mail.constants';
import {
  DatosCitaCompletada,
  DatosRecordatorioCita,
  DatosRecuperarContrasena,
  PlantillaCorreo,
  citaCompletadaTemplate,
  recordatorioCitaTemplate,
  recuperarContrasenaTemplate,
} from './templates';

export interface EnviarCorreoOptions {
  para: string | string[];
  asunto: string;
  html: string;
  texto?: string;
}

/**
 * Envía correos con Nodemailer. Es el único punto del sistema que habla
 * con el servidor SMTP.
 */
@Injectable()
export class MailService implements OnModuleInit {
  private readonly logger = new Logger(MailService.name);
  private readonly remitente: string;

  constructor(
    @Inject(MAIL_TRANSPORTER) private readonly transporter: Transporter,
    configService: ConfigService,
  ) {
    this.remitente = configService.getOrThrow<string>('MAIL_FROM');
  }

  /** Al arrancar comprueba la conexión SMTP; si falla solo avisa en el log. */
  async onModuleInit(): Promise<void> {
    try {
      await this.transporter.verify();
      this.logger.log('Conexión con el servidor de correo verificada');
    } catch (error) {
      this.logger.warn(
        `No se pudo verificar el servidor de correo: ${this.mensaje(error)}`,
      );
    }
  }

  /** Envío genérico. Prefiere los métodos específicos de abajo. */
  async enviar(opciones: EnviarCorreoOptions): Promise<boolean> {
    try {
      const info = await this.transporter.sendMail({
        from: this.remitente,
        to: opciones.para,
        subject: opciones.asunto,
        html: opciones.html,
        text: opciones.texto,
      });

      // No se registra el destinatario: es un dato personal.
      this.logger.log(`Correo "${opciones.asunto}" enviado (${info.messageId})`);
      return true;
    } catch (error) {
      this.logger.error(
        `No se pudo enviar el correo "${opciones.asunto}": ${this.mensaje(error)}`,
      );
      return false;
    }
  }

  /** RF-003: enlace para restablecer la contraseña. */
  enviarRecuperacionContrasena(
    para: string,
    datos: DatosRecuperarContrasena,
  ): Promise<boolean> {
    return this.enviarPlantilla(para, recuperarContrasenaTemplate(datos));
  }

  /** RF-007: aviso al dueño de que la cita terminó. */
  enviarCitaCompletada(
    para: string,
    datos: DatosCitaCompletada,
  ): Promise<boolean> {
    return this.enviarPlantilla(para, citaCompletadaTemplate(datos));
  }

  /** RF-016: recordatorio previo a la cita (dueño y trabajador). */
  enviarRecordatorioCita(
    para: string,
    datos: DatosRecordatorioCita,
  ): Promise<boolean> {
    return this.enviarPlantilla(para, recordatorioCitaTemplate(datos));
  }

  private enviarPlantilla(
    para: string,
    plantilla: PlantillaCorreo,
  ): Promise<boolean> {
    return this.enviar({ para, ...plantilla });
  }

  private mensaje(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
  }
}
