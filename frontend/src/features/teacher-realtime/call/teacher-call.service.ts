import api from "@/services/api";

export const teacherCallService = {
  createSession: async (targetUserId: string): Promise<{ callId: string }> => {
    const response = await api.post("/teacher-realtime/calls/session", { targetUserId });
    return response.data?.data || response.data;
  },
};
