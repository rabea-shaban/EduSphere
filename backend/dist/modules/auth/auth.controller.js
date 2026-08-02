"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAvatar = exports.changePassword = exports.updateProfile = exports.getCurrentUser = exports.resendVerification = exports.verifyEmail = exports.resetPassword = exports.forgotPassword = exports.refresh = exports.logout = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const user_model_1 = __importDefault(require("../users/user.model"));
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
// Token generation helpers
const generateAccessToken = (payload) => {
    const secret = process.env.JWT_SECRET || 'jwt_access_secret_key_change_me';
    const options = {
        expiresIn: (process.env.JWT_EXPIRES || '1d'),
    };
    return jsonwebtoken_1.default.sign({ ...payload }, secret, options);
};
const generateRefreshToken = (payload) => {
    const secret = process.env.REFRESH_SECRET || 'jwt_refresh_secret_key_change_me';
    const options = {
        expiresIn: (process.env.REFRESH_EXPIRES || '7d'),
    };
    return jsonwebtoken_1.default.sign({ ...payload }, secret, options);
};
const setRefreshTokenCookie = (res, token) => {
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('refreshToken', token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days matching REFRESH_EXPIRES
    });
};
const clearRefreshTokenCookie = (res) => {
    const isProduction = process.env.NODE_ENV === 'production';
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
    });
};
// Crypto token helpers for verify/reset flows
const generateRandomToken = () => {
    return crypto_1.default.randomBytes(32).toString('hex');
};
const hashToken = (token) => {
    return crypto_1.default.createHash('sha256').update(token).digest('hex');
};
/**
 * Register a new user.
 */
exports.register = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { username, email, phone, role } = req.body;
    if (role === 'SUPER_ADMIN') {
        throw new ApiError_1.ApiError(403, 'SUPER_ADMIN accounts cannot be created via registration. Super Admin credentials are managed via system seeders.');
    }
    // 1. Check uniqueness
    const existingUser = await user_model_1.default.findOne({
        $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }, { phone }],
    });
    if (existingUser) {
        if (existingUser.username === username.toLowerCase()) {
            throw new ApiError_1.ApiError(400, 'Username is already taken');
        }
        if (existingUser.email === email.toLowerCase()) {
            throw new ApiError_1.ApiError(400, 'Email address is already in use');
        }
        if (existingUser.phone === phone) {
            throw new ApiError_1.ApiError(400, 'Phone number is already registered');
        }
    }
    // 2. Create the user
    const user = await user_model_1.default.create({
        ...req.body,
        isVerified: true, // Verified immediately without email verification step
    });
    // 3. Generate JWT tokens
    const accessToken = generateAccessToken({ userId: user._id.toString(), role: user.role });
    const refreshToken = generateRefreshToken({ userId: user._id.toString() });
    // 4. Store refresh token in user and DB
    user.refreshToken = refreshToken;
    await user.save();
    // 5. Set HTTP-only Cookie
    setRefreshTokenCookie(res, refreshToken);
    const userResponse = user.toObject();
    delete userResponse.password;
    res.status(201).json(new ApiResponse_1.ApiResponse(201, {
        user: userResponse,
        accessToken,
        refreshToken,
    }, 'Registration successful.'));
});
/**
 * Login handler.
 */
exports.login = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { emailOrUsername, password } = req.body;
    // 1. Find user, explicitly selecting password and refreshToken
    const user = await user_model_1.default.findOne({
        $or: [
            { email: emailOrUsername.toLowerCase() },
            { username: emailOrUsername.toLowerCase() },
        ],
    }).select('+password +refreshToken');
    if (!user) {
        throw new ApiError_1.ApiError(401, 'Invalid login credentials');
    }
    // 2. Check password matches
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
        throw new ApiError_1.ApiError(401, 'Invalid login credentials');
    }
    // 3. Assert account status checks
    if (user.isBlocked) {
        throw new ApiError_1.ApiError(403, 'Your account is blocked. Please contact support.');
    }
    if (!user.isVerified) {
        throw new ApiError_1.ApiError(401, 'Your email is not verified. Please verify your email first.');
    }
    // 4. Update last login
    user.lastLogin = new Date();
    // 5. Generate and store tokens
    const accessToken = generateAccessToken({ userId: user._id.toString(), role: user.role });
    const refreshToken = generateRefreshToken({ userId: user._id.toString() });
    user.refreshToken = refreshToken;
    await user.save();
    // 6. Set HTTP-only Cookie
    setRefreshTokenCookie(res, refreshToken);
    const userResponse = user.toObject();
    delete userResponse.password;
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        user: userResponse,
        accessToken,
    }, 'Login successful'));
});
/**
 * Logout handler.
 */
exports.logout = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
        try {
            const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_SECRET || 'jwt_refresh_secret_key_change_me');
            // Invalidate token in DB
            await user_model_1.default.updateOne({ _id: decoded.userId }, { $unset: { refreshToken: 1 } });
        }
        catch {
            // Ignore token validation issues on logout, just continue to clear cookies
        }
    }
    clearRefreshTokenCookie(res);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'Logged out successfully'));
});
/**
 * Refresh access token handler.
 */
exports.refresh = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new ApiError_1.ApiError(401, 'Session expired. Please log in again.');
    }
    let decoded;
    try {
        decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_SECRET || 'jwt_refresh_secret_key_change_me');
    }
    catch {
        throw new ApiError_1.ApiError(401, 'Invalid or expired session. Please log in again.');
    }
    const user = await user_model_1.default.findById(decoded.userId).select('+refreshToken');
    if (!user || user.isBlocked || !user.isVerified || user.refreshToken !== refreshToken) {
        throw new ApiError_1.ApiError(401, 'Session invalid or user suspended.');
    }
    // Rotate tokens
    const newAccessToken = generateAccessToken({ userId: user._id.toString(), role: user.role });
    const newRefreshToken = generateRefreshToken({ userId: user._id.toString() });
    user.refreshToken = newRefreshToken;
    await user.save();
    setRefreshTokenCookie(res, newRefreshToken);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        accessToken: newAccessToken,
    }, 'Token refreshed successfully'));
});
/**
 * Request password reset token.
 */
exports.forgotPassword = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { email } = req.body;
    const user = await user_model_1.default.findOne({ email: email.toLowerCase() });
    if (!user) {
        throw new ApiError_1.ApiError(404, 'No user found with that email address');
    }
    const rawResetToken = generateRandomToken();
    user.passwordResetToken = hashToken(rawResetToken);
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
    await user.save();
    // In a real application, email this link. For sprint validation, return it in payload.
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        resetToken: rawResetToken,
    }, 'Password reset token generated. Send this token to reset your password.'));
});
/**
 * Reset password using token.
 */
exports.resetPassword = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { token, password } = req.body;
    const hashedToken = hashToken(token);
    const user = await user_model_1.default.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: new Date() },
    });
    if (!user) {
        throw new ApiError_1.ApiError(400, 'Invalid or expired password reset token');
    }
    // Update password and clear reset token fields
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.refreshToken = undefined; // Force re-authentication on all devices
    await user.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'Password reset successful. Please log in with your new password.'));
});
/**
 * Verify Email verification token.
 */
exports.verifyEmail = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { token } = req.body;
    const hashedToken = hashToken(token);
    const user = await user_model_1.default.findOne({
        verificationToken: hashedToken,
        verificationTokenExpires: { $gt: new Date() },
    }).setOptions({ withDeleted: true });
    if (!user) {
        throw new ApiError_1.ApiError(400, 'Invalid or expired email verification token');
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'Email verified successfully. You can now log in.'));
});
/**
 * Resend email verification token.
 */
exports.resendVerification = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { email } = req.body;
    const user = await user_model_1.default.findOne({ email: email.toLowerCase() });
    if (!user) {
        throw new ApiError_1.ApiError(404, 'No user found with that email address');
    }
    if (user.isVerified) {
        throw new ApiError_1.ApiError(400, 'This account is already verified');
    }
    const rawVerificationToken = generateRandomToken();
    user.verificationToken = hashToken(rawVerificationToken);
    user.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await user.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        verificationToken: rawVerificationToken,
    }, 'Verification token resent successfully.'));
});
/**
 * Get current logged in user details.
 */
exports.getCurrentUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    // req.user is appended by auth protect middleware
    const user = req.user;
    res.status(200).json(new ApiResponse_1.ApiResponse(200, user, 'Current user profile fetched successfully'));
});
/**
 * Update authenticated user profile.
 */
exports.updateProfile = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user?._id;
    const user = await user_model_1.default.findById(userId);
    if (!user) {
        throw new ApiError_1.ApiError(404, 'User profile not found');
    }
    const { phone } = req.body;
    if (phone && phone !== user.phone) {
        const phoneExists = await user_model_1.default.findOne({ phone });
        if (phoneExists) {
            throw new ApiError_1.ApiError(400, 'Phone number is already registered by another account');
        }
    }
    // Update allowed profile fields
    Object.assign(user, req.body);
    await user.save();
    const userResponse = user.toObject();
    delete userResponse.password;
    res.status(200).json(new ApiResponse_1.ApiResponse(200, userResponse, 'Profile updated successfully'));
});
/**
 * Change authenticated user password.
 */
exports.changePassword = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user?._id;
    const { currentPassword, newPassword } = req.body;
    const user = await user_model_1.default.findById(userId).select('+password');
    if (!user) {
        throw new ApiError_1.ApiError(404, 'User profile not found');
    }
    const isPasswordMatch = await user.comparePassword(currentPassword);
    if (!isPasswordMatch) {
        throw new ApiError_1.ApiError(400, 'Incorrect current password');
    }
    user.password = newPassword;
    user.refreshToken = undefined; // Force logout everywhere
    await user.save();
    clearRefreshTokenCookie(res);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'Password changed successfully. Please log in again.'));
});
/**
 * Update authenticated user avatar.
 */
exports.updateAvatar = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user?._id;
    const { avatar } = req.body;
    const user = await user_model_1.default.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true });
    if (!user) {
        throw new ApiError_1.ApiError(404, 'User profile not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, user, 'Avatar updated successfully'));
});
