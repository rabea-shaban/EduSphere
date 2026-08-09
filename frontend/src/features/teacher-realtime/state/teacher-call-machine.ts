import { TeacherCallStatus } from '../types/teacher-realtime.types';

export const LEGAL_TRANSITIONS: Record<TeacherCallStatus, TeacherCallStatus[]> = {
  IDLE: ['RINGING', 'FAILED'],
  RINGING: ['ACCEPTED', 'REJECTED', 'BUSY', 'TIMEOUT', 'ENDED', 'FAILED'],
  ACCEPTED: ['CONNECTING', 'FAILED', 'ENDED'],
  CONNECTING: ['CONNECTED', 'FAILED', 'ENDED'],
  CONNECTED: ['ENDING', 'ENDED', 'FAILED'],
  ENDING: ['ENDED'],
  REJECTED: ['IDLE'],
  BUSY: ['IDLE'],
  TIMEOUT: ['IDLE'],
  ENDED: ['IDLE'],
  FAILED: ['IDLE'],
};

export function canTransition(current: TeacherCallStatus, next: TeacherCallStatus): boolean {
  return LEGAL_TRANSITIONS[current]?.includes(next) ?? false;
}
