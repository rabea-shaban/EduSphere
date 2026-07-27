import { Schema, model, Document } from 'mongoose';

export interface IPermissionItem {
  module: string;
  actions: string[];
}

export interface IRole {
  name: string;
  displayNameAr: string;
  displayNameEn: string;
  description?: string;
  isSystem: boolean;
  isActive: boolean;
  permissions: IPermissionItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IRoleDocument extends IRole, Document {}

const roleSchema = new Schema<IRoleDocument>(
  {
    name: {
      type: String,
      required: [true, 'Role name key is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    displayNameAr: {
      type: String,
      required: [true, 'Arabic display name is required'],
      trim: true,
    },
    displayNameEn: {
      type: String,
      required: [true, 'English display name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    isSystem: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    permissions: [
      {
        module: { type: String, required: true },
        actions: [{ type: String }],
      },
    ],
  },
  {
    timestamps: true,
  }
);

roleSchema.index({ name: 1 });
roleSchema.index({ isSystem: 1 });

export const Role = model<IRoleDocument>('Role', roleSchema);
export default Role;
