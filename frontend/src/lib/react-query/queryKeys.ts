/**
 * Centralized, type-safe Query Key Factory for EduSphere frontend.
 * 
 * Provides structured query keys across all platform domains.
 * Following TanStack React Query v5 hierarchical key array structure:
 * - root domain array: e.g. ['auth'], ['courses'], ['teacher']
 * - sub-entities: e.g. ['courses', 'detail', id]
 * 
 * Invalidation rules:
 * - Invalidating `queryKeys.courses.all` will invalidate all course queries.
 * - Invalidating `queryKeys.student.myCourses()` invalidates all student enrolled courses.
 */

export const queryKeys = {
  // ── Auth Domain ─────────────────────────────────────────────────────────────
  auth: {
    all: ["auth"] as const,
    currentUser: () => ["auth", "currentUser"] as const,
    session: () => ["auth", "session"] as const,
  },

  // ── Student Domain ──────────────────────────────────────────────────────────
  student: {
    all: ["student"] as const,
    profile: () => ["student", "profile"] as const,
    myCourses: (status?: string) => ["student", "myCourses", status ?? "all"] as const,
    courseDetails: (id: string) => ["student", "course", id] as const,
    courseProgress: (courseId: string) => ["student", "progress", courseId] as const,
    quizzes: (courseId?: string) => ["student", "quizzes", courseId ?? "all"] as const,
    quizDetails: (id: string) => ["student", "quiz", id] as const,
    examAttempts: (quizId?: string) => ["student", "examAttempts", quizId ?? "all"] as const,
    assignments: (courseId?: string) => ["student", "assignments", courseId ?? "all"] as const,
    assignmentDetails: (id: string) => ["student", "assignment", id] as const,
    submissions: (assignmentId?: string) => ["student", "submissions", assignmentId ?? "all"] as const,
    notifications: (params?: Record<string, any>) => ["student", "notifications", params ?? {}] as const,
  },

  // ── Teacher Domain ──────────────────────────────────────────────────────────
  teacher: {
    all: ["teacher"] as const,
    dashboard: () => ["teacher", "dashboard"] as const,
    profile: {
      all: ["teacher", "profile"] as const,
      details: () => ["teacher", "profile", "details"] as const,
      completeness: () => ["teacher", "profile", "completeness"] as const,
      analytics: () => ["teacher", "profile", "analytics"] as const,
    },
    earnings: {
      all: ["teacher", "earnings"] as const,
      summary: () => ["teacher", "earnings", "summary"] as const,
      statement: (period?: string) => ["teacher", "earnings", "statement", period ?? "current"] as const,
      analytics: (range?: string) => ["teacher", "earnings", "analytics", range ?? "all"] as const,
    },
    withdrawals: {
      all: ["teacher", "withdrawals"] as const,
      wallet: () => ["teacher", "withdrawals", "wallet"] as const,
      history: () => ["teacher", "withdrawals", "history"] as const,
      list: (filters?: Record<string, any>) => ["teacher", "withdrawals", "list", filters ?? {}] as const,
      byId: (id: string) => ["teacher", "withdrawals", "id", id] as const,
    },
    students: {
      all: ["teacher", "students"] as const,
      list: (filters?: Record<string, any>) => ["teacher", "students", "list", filters ?? {}] as const,
      stats: () => ["teacher", "students", "stats"] as const,
      byId: (id: string) => ["teacher", "students", "id", id] as const,
    },
    files: {
      all: ["teacher", "files"] as const,
      list: (filters?: Record<string, any>) => ["teacher", "files", "list", filters ?? {}] as const,
      storage: () => ["teacher", "files", "storage"] as const,
    },
    settings: {
      all: ["teacher", "settings"] as const,
      general: () => ["teacher", "settings", "general"] as const,
      notifications: () => ["teacher", "settings", "notifications"] as const,
      privacy: () => ["teacher", "settings", "privacy"] as const,
      security: () => ["teacher", "settings", "security"] as const,
    },
    analytics: {
      all: ["teacher", "analytics"] as const,
      overview: (range?: string) => ["teacher", "analytics", "overview", range ?? "all"] as const,
      courses: () => ["teacher", "analytics", "courses"] as const,
      students: () => ["teacher", "analytics", "students"] as const,
    },
    notifications: (params?: Record<string, any>) => ["teacher", "notifications", params ?? {}] as const,
  },

  // ── Admin Domain ────────────────────────────────────────────────────────────
  admin: {
    all: ["admin"] as const,
    dashboard: () => ["admin", "dashboard"] as const,
    users: (filters?: Record<string, any>) => ["admin", "users", filters ?? {}] as const,
    userDetail: (id: string) => ["admin", "user", id] as const,
    courses: (filters?: Record<string, any>) => ["admin", "courses", filters ?? {}] as const,
    courseDetail: (id: string) => ["admin", "course", id] as const,
    teachers: (filters?: Record<string, any>) => ["admin", "teachers", filters ?? {}] as const,
    teacherDetail: (id: string) => ["admin", "teacher", id] as const,
    teacherApplications: (filters?: Record<string, any>) => ["admin", "teacher-applications", filters ?? {}] as const,
    teacherApplicationDetail: (id: string) => ["admin", "teacher-application", id] as const,
    students: (filters?: Record<string, any>) => ["admin", "students", filters ?? {}] as const,
    studentDetail: (id: string) => ["admin", "student", id] as const,
    payments: (filters?: Record<string, any>) => ["admin", "payments", filters ?? {}] as const,
    withdrawals: (filters?: Record<string, any>) => ["admin", "withdrawals", filters ?? {}] as const,
    coupons: (filters?: Record<string, any>) => ["admin", "coupons", filters ?? {}] as const,
    couponDetail: (id: string) => ["admin", "coupon", id] as const,
    categories: () => ["admin", "categories"] as const,
    subjects: () => ["admin", "subjects"] as const,
    grades: () => ["admin", "grades"] as const,
    auditLogs: (filters?: Record<string, any>) => ["admin", "audit-logs", filters ?? {}] as const,
    reports: () => ["admin", "reports"] as const,
    settings: () => ["admin", "settings"] as const,
    blog: (filters?: Record<string, any>) => ["admin", "blog", filters ?? {}] as const,
    roles: () => ["admin", "roles"] as const,
    subscriptions: (filters?: Record<string, any>) => ["admin", "subscriptions", filters ?? {}] as const,
  },

  // ── Curriculum / Academic Domain ────────────────────────────────────────────
  academic: {
    all: ["academic"] as const,
    faculties: () => ["academic", "faculties"] as const,
    departments: (facultyId?: string) => ["academic", "departments", facultyId ?? "all"] as const,
    subjects: (stage?: string) => ["academic", "subjects", stage ?? "all"] as const,
    grades: () => ["academic", "grades"] as const,
  },

  // ── Content Domain (Lessons, Sections, Quizzes, Assignments, Reviews) ─────
  lessons: {
    all: ["lessons"] as const,
    bySection: (sectionId: string) => ["lessons", "section", sectionId] as const,
    byId: (id: string) => ["lessons", "id", id] as const,
    search: (filters?: Record<string, any>) => ["lessons", "search", filters ?? {}] as const,
  },

  sections: {
    all: ["sections"] as const,
    byCourse: (courseId: string) => ["sections", "course", courseId] as const,
    byId: (id: string) => ["sections", "id", id] as const,
  },

  quizzes: {
    all: ["quizzes"] as const,
    byCourse: (courseId: string) => ["quizzes", "course", courseId] as const,
    byId: (id: string) => ["quizzes", "id", id] as const,
    attempts: (quizId: string) => ["quizzes", "attempts", quizId] as const,
  },

  assignments: {
    all: ["assignments"] as const,
    byCourse: (courseId: string) => ["assignments", "course", courseId] as const,
    byId: (id: string) => ["assignments", "id", id] as const,
    submissions: (assignmentId: string) => ["assignments", "submissions", assignmentId] as const,
  },

  reviews: {
    all: ["reviews"] as const,
    byCourse: (courseId: string) => ["reviews", "course", courseId] as const,
  },

  // ── General Systems Domain (Notifications, Search, Payment) ────────────────
  notifications: {
    all: ["notifications"] as const,
    header: () => ["notifications", "header"] as const,
    list: (params?: Record<string, any>) => ["notifications", "list", params ?? {}] as const,
  },

  search: {
    all: ["search"] as const,
    query: (q: string, filters?: Record<string, any>) => ["search", q, filters ?? {}] as const,
  },

  payment: {
    all: ["payment"] as const,
    methods: () => ["payment", "methods"] as const,
    history: () => ["payment", "history"] as const,
  },
} as const;

export type QueryKeys = typeof queryKeys;
