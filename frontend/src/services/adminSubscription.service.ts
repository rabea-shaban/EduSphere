import api from "./api";

export interface SubscriptionPlanItem {
  _id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  subscriptionType: "Free" | "Monthly" | "Yearly" | "Lifetime";
  durationMonths?: number;
  features: string[];
  maxCoursesAccess?: number;
  isPopular?: boolean;
  status: "Active" | "Inactive";
  createdAt: string;
  subscribersCount?: number;
}

export interface GetSubscriptionsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  status?: string;
}

export interface GetSubscriptionsResponse {
  plans: SubscriptionPlanItem[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const adminSubscriptionService = {
  // Get all subscription plans
  getPlans: async (params: GetSubscriptionsQueryParams = {}): Promise<GetSubscriptionsResponse> => {
    const response = await api.get("/subscriptions", { params });
    const data = response.data?.data;
    if (Array.isArray(data)) {
      return { plans: data };
    }
    return data || { plans: [] };
  },

  // Create plan
  createPlan: async (planData: Partial<SubscriptionPlanItem>): Promise<SubscriptionPlanItem> => {
    const response = await api.post("/subscriptions", planData);
    return response.data?.data;
  },

  // Update plan
  updatePlan: async (id: string, planData: Partial<SubscriptionPlanItem>): Promise<SubscriptionPlanItem> => {
    const response = await api.patch(`/subscriptions/${id}`, planData);
    return response.data?.data;
  },

  // Activate plan
  activatePlan: async (id: string): Promise<any> => {
    const response = await api.patch(`/subscriptions/${id}/activate`);
    return response.data;
  },

  // Deactivate plan
  deactivatePlan: async (id: string): Promise<any> => {
    const response = await api.patch(`/subscriptions/${id}/deactivate`);
    return response.data;
  },

  // Delete plan
  deletePlan: async (id: string): Promise<any> => {
    const response = await api.delete(`/subscriptions/${id}`);
    return response.data;
  },
};

export default adminSubscriptionService;
