import {
  BadRequestException,
  Injectable,
  PayloadTooLargeException,
  PipeTransform,
  UnsupportedMediaTypeException,
} from '@nestjs/common';

/** Forma mínima del archivo que entrega multer (FileInterceptor). */
export interface UploadedImage {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

export interface ParseImageFileOptions {
  /** Tamaño máximo en bytes. Por defecto 5 MB. */
  maxBytes?: number;
  /** Si es false, permite que no se envíe archivo. Por defecto true. */
  required?: boolean;
}

/**
 * Valida imágenes subidas: foto de la mascota (RF-002) y evidencia de
 * peluquería antes/después (RF-009).
 *
 * Revisa tres cosas:
 * 1. Que se haya enviado un archivo.
 * 2. Que no pase del tamaño máximo.
 * 3. Que sea JPG, PNG o WEBP de verdad: se comparan los primeros bytes del
 *    archivo (firma), no solo el tipo que declara el cliente, porque ese
 *    se puede falsificar (RNF-007).
 *
 * Uso:
 *   @UseInterceptors(FileInterceptor('foto'))
 *   crear(@UploadedFile(new ParseImageFilePipe()) foto: UploadedImage) {}
 *
 * Requiere que multer guarde el archivo en memoria (por defecto en
 * FileInterceptor), de modo que `file.buffer` esté disponible.
 */
@Injectable()
export class ParseImageFilePipe
  implements PipeTransform<UploadedImage | undefined, UploadedImage | undefined>
{
  private readonly maxBytes: number;
  private readonly required: boolean;

  constructor(options: ParseImageFileOptions = {}) {
    this.maxBytes = options.maxBytes ?? 5 * 1024 * 1024;
    this.required = options.required ?? true;
  }

  transform(file: UploadedImage | undefined): UploadedImage | undefined {
    if (!file) {
      if (this.required) {
        throw new BadRequestException('Debes adjuntar una imagen');
      }
      return undefined;
    }

    if (file.size > this.maxBytes) {
      const mb = (this.maxBytes / (1024 * 1024)).toFixed(0);
      throw new PayloadTooLargeException(
        `La imagen no puede pesar más de ${mb} MB`,
      );
    }

    if (!this.esImagenPermitida(file.buffer)) {
      throw new UnsupportedMediaTypeException(
        'Solo se permiten imágenes JPG, PNG o WEBP',
      );
    }

    return file;
  }

  /** Compara la firma (magic bytes) del archivo con los formatos permitidos. */
  private esImagenPermitida(buffer: Buffer | undefined): boolean {
    if (!buffer || buffer.length < 12) {
      return false;
    }

    const esJpg =
      buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;

    const esPng = buffer
      .subarray(0, 8)
      .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));

    const esWebp =
      buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
      buffer.subarray(8, 12).toString('ascii') === 'WEBP';

    return esJpg || esPng || esWebp;
  }
}
