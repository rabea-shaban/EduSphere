export type TeacherCallStatus =
  | "IDLE"
  | "RINGING"
  | "ACCEPTED"
  | "CONNECTING"
  | "CONNECTED"
  | "ENDING"
  | "REJECTED"
  | "BUSY"
  | "TIMEOUT"
  | "ENDED"
  | "FAILED";

export interface TeacherCallSessionState {
  callId: string;
  partnerId: string;
  partnerName: string;
  partnerAvatar?: string;
  partnerRole?: string;
  conversationId?: string;
  role: "caller" | "receiver";
  status: TeacherCallStatus;
}

export interface IncomingTeacherCallPayload {
  callId: string;
  from: string;
  callerName: string;
  callerAvatar?: string;
  callerRole?: string;
  conversationId?: string;
}

export interface TeacherChatMessage {
  _id: string;
  conversationId: string;
  senderId: string | { _id: string; firstName?: string; lastName?: string; avatar?: string };
  recipientId?: string;
  text: string;
  clientMessageId: string;
  createdAt: string;
  status?: "sending" | "sent" | "failed";
}
