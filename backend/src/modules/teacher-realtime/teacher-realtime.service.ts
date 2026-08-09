import { TeacherCallSession } from './teacher-realtime.types';

export interface ITeacherCallSessionStore {
  create(session: TeacherCallSession): Promise<TeacherCallSession>;
  get(callId: string): Promise<TeacherCallSession | null>;
  update(callId: string, updates: Partial<TeacherCallSession>): Promise<TeacherCallSession | null>;
  delete(callId: string): Promise<boolean>;
  hasActiveCall(userId: string): Promise<boolean>;
  findByUser(userId: string): Promise<TeacherCallSession | null>;
}

export class MemoryTeacherCallSessionStore implements ITeacherCallSessionStore {
  private sessions = new Map<string, TeacherCallSession>();

  async create(session: TeacherCallSession): Promise<TeacherCallSession> {
    this.sessions.set(session.callId, session);
    return session;
  }

  async get(callId: string): Promise<TeacherCallSession | null> {
    return this.sessions.get(callId) || null;
  }

  async update(callId: string, updates: Partial<TeacherCallSession>): Promise<TeacherCallSession | null> {
    const existing = this.sessions.get(callId);
    if (!existing) return null;
    const updated = { ...existing, ...updates };
    this.sessions.set(callId, updated);
    return updated;
  }

  async delete(callId: string): Promise<boolean> {
    return this.sessions.delete(callId);
  }

  async hasActiveCall(userId: string): Promise<boolean> {
    for (const session of this.sessions.values()) {
      if (
        (session.teacherId === userId || session.studentId === userId) &&
        ['RINGING', 'ACCEPTED', 'CONNECTING', 'CONNECTED'].includes(session.status)
      ) {
        return true;
      }
    }
    return false;
  }

  async findByUser(userId: string): Promise<TeacherCallSession | null> {
    for (const session of this.sessions.values()) {
      if (
        (session.teacherId === userId || session.studentId === userId) &&
        ['RINGING', 'ACCEPTED', 'CONNECTING', 'CONNECTED'].includes(session.status)
      ) {
        return session;
      }
    }
    return null;
  }
}

export const teacherCallSessionStore = new MemoryTeacherCallSessionStore();
