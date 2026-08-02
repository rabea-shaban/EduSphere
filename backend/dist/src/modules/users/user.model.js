"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        select: false,
    },
    avatar: {
        type: String,
        default: 'https://api.dicebear.com/7.x/avataaars/svg?seed=edusphere-default',
    },
    gender: {
        type: String,
        enum: ['MALE', 'FEMALE', 'OTHER'],
    },
    dateOfBirth: {
        type: Date,
    },
    role: {
        type: String,
        enum: ['SUPER_ADMIN', 'ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
        required: [true, 'Role is required'],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    refreshToken: {
        type: String,
        select: false,
    },
    lastLogin: {
        type: Date,
    },
    lastActiveAt: {
        type: Date,
    },
    verificationToken: {
        type: String,
        select: false,
    },
    verificationTokenExpires: {
        type: Date,
        select: false,
    },
    passwordResetToken: {
        type: String,
        select: false,
    },
    passwordResetExpires: {
        type: Date,
        select: false,
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    updatedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    deletedAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});
// Indexes
userSchema.index({ role: 1 });
userSchema.index({ isBlocked: 1 });
userSchema.index({ deletedAt: 1 });
userSchema.index({ verificationToken: 1 });
userSchema.index({ passwordResetToken: 1 });
// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcryptjs_1.default.genSalt(10);
    this.password = await bcryptjs_1.default.hash(this.password || '', salt);
});
// Indexes
userSchema.index({ firstName: 'text', lastName: 'text', email: 'text', phone: 'text' });
userSchema.index({ role: 1, isBlocked: 1 });
userSchema.index({ role: 1, createdAt: -1 });
// Soft Delete Middleware filter for standard queries
userSchema.pre(/^find|^count/, function () {
    const options = this.getOptions();
    if (options && options.withDeleted) {
        return;
    }
    this.where({ deletedAt: null });
});
// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcryptjs_1.default.compare(candidatePassword, this.password || '');
};
exports.User = (0, mongoose_1.model)('User', userSchema);
exports.default = exports.User;
