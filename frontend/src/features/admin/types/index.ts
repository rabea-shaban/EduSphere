export interface PlatformHealth {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalRevenue: number;
  monthlyGrowthRate: number;
  activeCoursesCount: number;
  pendingPaymentsCount: number;
  pendingTeacherApprovalsCount: number;
  serverStatus: "healthy" | "warning" | "error";
}

export interface AdminStat {
  id: string;
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  iconName: string;
  colorScheme: "navy" | "orange" | "blue" | "emerald" | "amber" | "purple";
}

export interface UserRecord {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  role: "student" | "teacher" | "admin";
  stage?: string;
  status: "active" | "suspended" | "pending";
  createdAt: string;
  lastLogin: string;
}

export interface TeacherApprovalRequest {
  id: string;
  teacherName: string;
  avatar: string;
  email: string;
  phone: string;
  subject: string;
  qualifications: string[];
  experienceYears: number;
  appliedDate: string;
  status: "pending" | "approved" | "rejected";
}

export interface PaymentReviewItem {
  id: string;
  transactionRef: string;
  studentName: string;
  studentAvatar: string;
  courseTitle: string;
  amount: number;
  paymentMethod: "Vodafone Cash" | "Fawry" | "Meeza" | "Visa / MasterCard";
  receiptImage: string;
  date: string;
  status: "pending" | "approved" | "rejected";
}

export interface CouponItem {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  value: number;
  usageCount: number;
  maxUsage: number;
  expiresAt: string;
  status: "active" | "expired" | "disabled";
}

export interface AuditLogRecord {
  id: string;
  userName: string;
  userRole: "super_admin" | "admin" | "teacher" | "system";
  action: string;
  target: string;
  ipAddress: string;
  device: string;
  timestamp: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "payment" | "teacher" | "system" | "security";
}
