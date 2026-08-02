"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Term = void 0;
const mongoose_1 = require("mongoose");
const termSchema = new mongoose_1.Schema({
    name: {
        type: String,
        enum: ['First Term', 'Second Term'],
        required: [true, 'Term name is required'],
        unique: true,
    },
    order: {
        type: Number,
        required: [true, 'Term order is required'],
        unique: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
// Indexes
termSchema.index({ isActive: 1 });
exports.Term = (0, mongoose_1.model)('Term', termSchema);
exports.default = exports.Term;
