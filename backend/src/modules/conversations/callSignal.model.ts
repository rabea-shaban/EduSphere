import { Schema, model, Document } from 'mongoose';

export interface ICallSignalDocument extends Document {
  callerId: Schema.Types.ObjectId | string;
  targetUserId: Schema.Types.ObjectId | string;
  conversationId?: Schema.Types.ObjectId | string;
  callerName: string;
  callerAvatar?: string;
  callType: 'voice' | 'video';
  offer?: any;
  answer?: any;
  callerCandidates?: any[];
  targetCandidates?: any[];
  status: 'outgoing' | 'incoming' | 'connected' | 'rejected' | 'ended';
  createdAt: Date;
  updatedAt: Date;
}

const callSignalSchema = new Schema<ICallSignalDocument>(
  {
    callerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    targetUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation' },
    callerName: { type: String, default: 'مستخدم المنصة' },
    callerAvatar: { type: String },
    callType: { type: String, enum: ['voice', 'video'], default: 'voice' },
    offer: { type: Schema.Types.Mixed },
    answer: { type: Schema.Types.Mixed },
    callerCandidates: { type: [Schema.Types.Mixed], default: [] },
    targetCandidates: { type: [Schema.Types.Mixed], default: [] },
    status: {
      type: String,
      enum: ['outgoing', 'incoming', 'connected', 'rejected', 'ended'],
      default: 'outgoing',
    },
  },
  { timestamps: true }
);

callSignalSchema.index({ targetUserId: 1, status: 1 });
callSignalSchema.index({ callerId: 1, status: 1 });

export const CallSignal = model<ICallSignalDocument>('CallSignal', callSignalSchema);
