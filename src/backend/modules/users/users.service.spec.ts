import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { UsersService } from './users.service';

jest.mock('@nestjs/typeorm', () => ({
  InjectRepository: () => () => undefined,
}));

describe('UsersService password verification', () => {
  const update = jest.fn();
  const service = new UsersService({
    update,
  } as unknown as Repository<User>);
  let updatedPassword: string | undefined;

  beforeEach(() => {
    update.mockReset();
    updatedPassword = undefined;
    update.mockImplementation((_criteria: unknown, entity: Partial<User>) => {
      updatedPassword = entity.contrasena;
      return Promise.resolve({ affected: 1 });
    });
  });

  it('upgrades a valid legacy plaintext password to bcrypt', async () => {
    const user = { id_usuario: 7, contrasena: 'Prueba123*' };

    await expect(service.verifyPassword(user, 'Prueba123*')).resolves.toBe(
      true,
    );

    expect(update).toHaveBeenCalledTimes(1);
    expect(updatedPassword).toBeDefined();
    expect(updatedPassword).not.toBe('Prueba123*');
    if (!updatedPassword) {
      throw new Error('Expected the legacy password to be upgraded');
    }
    await expect(bcrypt.compare('Prueba123*', updatedPassword)).resolves.toBe(
      true,
    );
  });

  it('rejects an incorrect legacy password without modifying the account', async () => {
    const user = { id_usuario: 7, contrasena: 'Prueba123*' };

    await expect(service.verifyPassword(user, 'incorrecta')).resolves.toBe(
      false,
    );

    expect(update).not.toHaveBeenCalled();
  });

  it('verifies bcrypt passwords without rewriting them', async () => {
    const hash = await bcrypt.hash('Prueba123*', 10);
    const user = { id_usuario: 7, contrasena: hash };

    await expect(service.verifyPassword(user, 'Prueba123*')).resolves.toBe(
      true,
    );

    expect(update).not.toHaveBeenCalled();
  });
});
