"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicYear = void 0;
const mongoose_1 = require("mongoose");
const academicYearSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Academic year title is required'],
        unique: true,
        trim: true,
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required'],
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required'],
    },
    isCurrent: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE', 'PLANNED', 'ARCHIVED'],
        default: 'PLANNED',
    },
}, {
    timestamps: true,
});
// Pre-save hook: if marked as current, set all other academic years isCurrent to false
academicYearSchema.pre('save', async function () {
    if (this.isModified('isCurrent') && this.isCurrent === true) {
        const AcademicYear = this.constructor;
        await AcademicYear.updateMany({ _id: { $ne: this._id } }, { $set: { isCurrent: false } });
    }
});
exports.AcademicYear = (0, mongoose_1.model)('AcademicYear', academicYearSchema);
exports.default = exports.AcademicYear;
