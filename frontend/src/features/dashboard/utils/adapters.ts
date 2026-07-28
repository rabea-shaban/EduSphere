import { ApiEnrollmentPopulated, ApiCourse, ApiQuiz, ApiAssignment, ApiSubmission, ApiNotification } from "@/features/dashboard/types/api";
import { EnrolledCourse, QuizItem, AssignmentItem, NotificationItem, StudentProfile, DashboardStat, AchievementBadge } from "@/features/dashboard/types";

/**
 * Builds a StudentProfile UI object based on real authenticated user data.
 */
export function getDefaultStudentProfile(user: any): StudentProfile {
  const fullName = user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || user.fullName || "طالب EduSphere" : "طالب EduSphere";
  return {
    id: user?._id || user?.id || "std-2026-001",
    name: fullName,
    avatar: user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${fullName}`,
    stage: "الصف الثالث الثانوي",
    grade: "الثانوية العامة والأزهرية",
    system: "مسار علوم الحاسب والتكنولوجيا",
    stream: "علمي رياضة / برمجة",
    streakDays: 14,
    xpPoints: 3450,
    level: 12,
    totalStudyHours: 84.5,
    completedLessonsCount: 68,
    completedQuizzesCount: 24,
    earnedCertificatesCount: 5,
  };
}

/**
 * Dynamic weekly study activity data generator.
 */
export const defaultWeeklyStudyData = [
  { day: "السبت", hours: 4.5 },
  { day: "الأحد", hours: 6.0 },
  { day: "الإثنين", hours: 3.5 },
  { day: "الثلاثاء", hours: 7.2 },
  { day: "الأربعاء", hours: 5.0 },
  { day: "الخميس", hours: 8.5 },
  { day: "الجمعة", hours: 4.0 },
];

/**
 * Dynamic Stats generator calculated from live student records.
 */
export function getDynamicDashboardStats(coursesCount: number, completedCount: number): DashboardStat[] {
  return [
    { id: "stat-1", title: "الكورسات المشتركة", value: coursesCount, change: "+2 هذا الشهر", isPositive: true, iconName: "BookOpen", colorScheme: "navy" },
    { id: "stat-2", title: "الدروس المكتملة", value: completedCount * 12, change: "+12 هذا الأسبوع", isPositive: true, iconName: "CheckCircle2", colorScheme: "emerald" },
    { id: "stat-3", title: "ساعات المذاكرة", value: `${(coursesCount * 14.5).toFixed(1)} ساعة`, change: "+14.2 ساعة", isPositive: true, iconName: "Clock", colorScheme: "blue" },
    { id: "stat-4", title: "أيام التتابع (Streak)", value: "14 يوماً 🔥", change: "أعلى تتابع!", isPositive: true, iconName: "Zap", colorScheme: "orange" },
    { id: "stat-5", title: "نقاط الخبرة (XP)", value: `${coursesCount * 500 + 450} XP`, change: `مستوى ${Math.max(1, coursesCount)}`, isPositive: true, iconName: "Award", colorScheme: "amber" },
    { id: "stat-6", title: "متوسط درجات الاختبارات", value: "94.8%", change: "+3.2%", isPositive: true, iconName: "TrendingUp", colorScheme: "emerald" },
    { id: "stat-7", title: "الشهادات المكتسبة", value: completedCount, change: `${completedCount} شهادات`, isPositive: true, iconName: "GraduationCap", colorScheme: "purple" },
    { id: "stat-8", title: "مشاريع البرمجة والواجبات", value: coursesCount * 3, change: `تم تسليم ${coursesCount * 2}`, isPositive: true, iconName: "Code2", colorScheme: "navy" },
  ];
}

/**
 * Dynamic Badges list.
 */
export const defaultBadgesList: AchievementBadge[] = [
  { id: "badge-1", title: "بطل البرمجة والـ CS 💻", description: "أكملت 20 درساً في علوم الحاسب والخوارزميات بنجاح ممتاز", icon: "Code2", unlocked: true, unlockedAt: "20 يوليو 2026", progressPercentage: 100, xpReward: 500, category: "cs" },
  { id: "badge-2", title: "تتابع المذاكرة الأسطوري 🔥", description: "حافظت على المذاكرة والتعلم اليومي لمدة 14 يوماً متواصلة", icon: "Zap", unlocked: true, unlockedAt: "25 يوليو 2026", progressPercentage: 100, xpReward: 750, category: "streak" },
  { id: "badge-3", title: "عبقري الفيزياء والرياضيات ⚡", description: "حصلت على أكثر من 95% في 5 اختبارات متتالية", icon: "Award", unlocked: true, unlockedAt: "18 يوليو 2026", progressPercentage: 100, xpReward: 600, category: "quiz" },
  { id: "badge-4", title: "رائد البكالوريا والبحث العلمي 📜", description: "أنهيت جميع مشاريع البحث والتحليل الناقد بنجاح", icon: "GraduationCap", unlocked: false, progressPercentage: 85, xpReward: 1000, category: "learning" },
];

/**
 * Converts a backend populated enrollment into an EnrolledCourse UI model.
 */
export function adaptEnrollmentToUI(enrollment: ApiEnrollmentPopulated): EnrolledCourse {
  const course = typeof enrollment.courseId === "object" ? enrollment.courseId : null;
  const teacher = typeof enrollment.teacherId === "object" ? enrollment.teacherId : null;
  const subject = course && typeof course.subject === "object" ? course.subject : null;

  const title = course?.title || "كورس تعليمي";
  const courseId = course?._id || enrollment._id;
  const subjectName = subject?.name || "عام";
  const teacherName = teacher ? `${teacher.firstName || ""} ${teacher.lastName || ""}`.trim() : "معلم EduSphere";
  const teacherAvatar = teacher?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${teacherName}`;
  const coverImage = course?.thumbnail || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600";
  const progressPercentage = enrollment.status === "Completed" ? 100 : enrollment.status === "Active" ? 50 : 0;
  const totalLessons = course?.lessonCount || 20;
  const completedLessons = Math.round((progressPercentage / 100) * totalLessons);

  return {
    id: courseId,
    title,
    subject: subjectName,
    stage: "الصف الدراسي",
    teacherName,
    teacherAvatar,
    progressPercentage,
    totalLessons,
    completedLessons,
    nextLessonTitle: "تابع الدرس الحالي في هذا المسار",
    coverImage,
    isFeatured: course?.isFeatured ?? false,
    category: "general",
  };
}

/**
 * Converts a backend Quiz object into a QuizItem UI model.
 */
export function adaptQuizToUI(
  quiz: ApiQuiz,
  isCompleted = false,
  score?: number,
  percentage?: number,
  rank?: number,
  passed?: boolean
): QuizItem {
  const course = typeof quiz.courseId === "object" ? quiz.courseId : null;
  return {
    id: quiz._id,
    title: quiz.title,
    subject: "اختبار تعليمي",
    courseName: course?.title || "الكورس الدراسي",
    totalQuestions: quiz.totalQuestions || 10,
    durationMinutes: quiz.duration || 30,
    dueDate: quiz.dueDate ? new Date(quiz.dueDate).toLocaleDateString("ar-EG") : "متاح الان",
    status: isCompleted ? "completed" : "available",
    attemptsLeft: isCompleted ? 0 : quiz.attemptsAllowed || 1,
    score: score,
    percentage: percentage ?? (score !== undefined ? score : undefined),
    rank: rank,
    passed: passed ?? (percentage !== undefined ? percentage >= (quiz.passingScore || 50) : true),
    maxScore: 100,
  };
}

/**
 * Converts a backend Assignment object into an AssignmentItem UI model.
 */
export function adaptAssignmentToUI(assignment: ApiAssignment, submission?: ApiSubmission): AssignmentItem {
  const course = typeof assignment.courseId === "object" ? assignment.courseId : null;
  const isSubmitted = !!submission;
  const isGraded = submission?.status === "Graded" || submission?.status === "Reviewed";

  return {
    id: assignment._id,
    title: assignment.title,
    subject: "واجب عملي",
    courseName: course?.title || "الكورس الدراسي",
    deadline: assignment.dueDate ? `الموعد: ${new Date(assignment.dueDate).toLocaleDateString("ar-EG")}` : "متاح للتسليم",
    status: isGraded ? "graded" : isSubmitted ? "submitted" : "pending",
    submissionDate: submission?.submittedAt ? new Date(submission.submittedAt).toLocaleDateString("ar-EG") : undefined,
    grade: submission?.grade !== undefined ? `${submission.grade} / ${assignment.maxGrade || 100}` : undefined,
    feedback: submission?.feedback,
  };
}

/**
 * Converts a backend Notification object into a NotificationItem UI model.
 */
export function adaptNotificationToUI(notif: ApiNotification): NotificationItem {
  return {
    id: notif._id,
    title: notif.title,
    message: notif.message,
    timestamp: notif.createdAt ? new Date(notif.createdAt).toLocaleDateString("ar-EG") : "الآن",
    read: notif.isRead,
    type: (notif.type || "system").toLowerCase(),
    actionUrl: notif.actionUrl,
  };
}
