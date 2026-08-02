"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = void 0;
const mongoose_1 = require("mongoose");
const roleSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true,
});
roleSchema.index({ isSystem: 1 });
exports.Role = (0, mongoose_1.model)('Role', roleSchema);
exports.default = exports.Role;
