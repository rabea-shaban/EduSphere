import { Document, Types } from 'mongoose';

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';
export type UserGender = 'MALE' | 'FEMALE' | 'OTHER';

export interface IUser {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  password?: string;
  avatar?: string;
  gender?: UserGender;
  dateOfBirth?: Date;
  role: UserRole;
  isVerified: boolean;
  isBlocked: boolean;
  refreshToken?: string;
  lastLogin?: Date;
  lastActiveAt?: Date;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserDocument extends IUser, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}
