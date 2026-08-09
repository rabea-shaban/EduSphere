export interface TeacherCallSession {
  callId: string;
  teacherId: string;
  studentId: string;
  status: 'IDLE' | 'RINGING' | 'ACCEPTED' | 'CONNECTING' | 'CONNECTED' | 'REJECTED' | 'BUSY' | 'TIMEOUT' | 'ENDED' | 'FAILED';
  callerRole: 'TEACHER' | 'STUDENT';
  createdAt: number;
  acceptedAt?: number;
  endedAt?: number;
  endedBy?: string;
  conversationId?: string;
}

export interface TeacherRealtimeMessagePayload {
  conversationId: string;
  recipientId: string;
  text: string;
  clientMessageId: string;
}
