import { Schema, model } from 'mongoose';
import { IMenuDocument } from './menu.interface';

const menuSchema = new Schema<IMenuDocument>(
  {
    title: { type: String, required: [true, 'Menu title is required'], trim: true },
    url: { type: String, required: [true, 'URL is required'], trim: true },
    parentId: { type: Schema.Types.ObjectId, ref: 'Menu' },
    displayOrder: { type: Number, default: 0 },
    target: { type: String, default: '_self' },
    isActive: { type: Boolean, default: true },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization' },
  },
  { timestamps: true }
);

menuSchema.index({ displayOrder: 1 });
menuSchema.index({ isActive: 1 });

export const Menu = model<IMenuDocument>('Menu', menuSchema);
export default Menu;
