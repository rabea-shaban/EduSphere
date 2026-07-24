import { Schema, model } from 'mongoose';
import { IAcademicYearDocument } from './academicYear.interface';

const academicYearSchema = new Schema<IAcademicYearDocument>(
  {
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
  },
  {
    timestamps: true,
  }
);

// Pre-save hook: if marked as current, set all other academic years isCurrent to false
academicYearSchema.pre('save', async function (this: IAcademicYearDocument) {
  if (this.isModified('isCurrent') && this.isCurrent === true) {
    const AcademicYear = this.constructor as any;
    await AcademicYear.updateMany(
      { _id: { $ne: this._id } },
      { $set: { isCurrent: false } }
    );
  }
});

export const AcademicYear = model<IAcademicYearDocument>('AcademicYear', academicYearSchema);
export default AcademicYear;
