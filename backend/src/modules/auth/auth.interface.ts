import { UserRole } from '../users/user.interface';

/**
 * JWT Access Token Payload interface.
 */
export interface IAccessTokenPayload {
  userId: string;
  role: UserRole;
}

/**
 * JWT Refresh Token Payload interface.
 */
export interface IRefreshTokenPayload {
  userId: string;
}
