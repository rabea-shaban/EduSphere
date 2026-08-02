"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Menu = void 0;
const mongoose_1 = require("mongoose");
const menuSchema = new mongoose_1.Schema({
    title: { type: String, required: [true, 'Menu title is required'], trim: true },
    url: { type: String, required: [true, 'URL is required'], trim: true },
    parentId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Menu' },
    displayOrder: { type: Number, default: 0 },
    target: { type: String, default: '_self' },
    isActive: { type: Boolean, default: true },
    organizationId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Organization' },
}, { timestamps: true });
menuSchema.index({ displayOrder: 1 });
menuSchema.index({ isActive: 1 });
exports.Menu = (0, mongoose_1.model)('Menu', menuSchema);
exports.default = exports.Menu;
