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

  it('should validate valid login payload', () => {
    const loginPayload = {
      email: 'john.doe@example.com',
      password: 'password123',
    };

    const { error } = loginSchema.validate(loginPayload);
    expect(error).toBeUndefined();
  });
});
