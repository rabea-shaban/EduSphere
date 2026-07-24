import { registerSchema, loginSchema } from '../src/modules/auth/auth.validation';

describe('Authentication Validation Unit Tests', () => {
  it('should validate valid user registration payload', () => {
    const validPayload = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      role: 'STUDENT',
    };

    const { error } = registerSchema.validate(validPayload);
    expect(error).toBeUndefined();
  });

  it('should reject invalid email in registration payload', () => {
    const invalidPayload = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'invalid-email-string',
      password: 'password123',
    };

    const { error } = registerSchema.validate(invalidPayload);
    expect(error).toBeDefined();
    expect(error?.details[0].message).toContain('email');
  });

  it('should reject SUPER_ADMIN role in registration payload', () => {
    const superAdminPayload = {
      firstName: 'Super',
      lastName: 'Admin',
      username: 'superadmin',
      email: 'superadmin@example.com',
      phone: '+10000000000',
      password: 'password123',
      role: 'SUPER_ADMIN',
    };

    const { error } = registerSchema.validate(superAdminPayload);
    expect(error).toBeDefined();
    expect(error?.details[0].message).toContain('SUPER_ADMIN');
  });

  it('should validate valid login payload', () => {
    const loginPayload = {
      emailOrUsername: 'john.doe@example.com',
      password: 'password123',
    };

    const { error } = loginSchema.validate(loginPayload);
    expect(error).toBeUndefined();
  });
});
