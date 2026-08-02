"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dailyCheckIn = exports.getStudentAchievements = exports.getCourseProgress = exports.updateProgress = void 0;
const progress_model_1 = require("./progress.model");
const enrollment_model_1 = require("../enrollments/enrollment.model");
const lesson_model_1 = require("../lessons/lesson.model");
const examAttempt_model_1 = require("../examAttempts/examAttempt.model");
const notification_model_1 = require("../notifications/notification.model");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
/**
 * Update lesson progress (Continue Learning).
 * If all lessons are completed, the enrollment status is automatically set to Completed.
 */
exports.updateProgress = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { courseId, lessonId, watchTime, videoProgress, completed, lastPosition } = req.body;
    const studentId = req.user?._id;
    if (!studentId) {
        throw new ApiError_1.ApiError(401, 'Unauthorized');
    }
    // 1. Verify active enrollment in the course
    const enrollment = await enrollment_model_1.Enrollment.findOne({
        studentId,
        courseId,
        status: { $in: ['Active', 'Completed'] },
    });
    if (!enrollment) {
        throw new ApiError_1.ApiError(403, 'You are not enrolled in this course or your enrollment is inactive');
    }
    // 2. Find or create progress record
    let progress = await progress_model_1.Progress.findOne({ studentId, lessonId });
    if (!progress) {
        progress = new progress_model_1.Progress({
            studentId,
            courseId,
            lessonId,
            watchTime,
            videoProgress,
            completed,
            lastPosition,
        });
    }
    else {
        if (watchTime !== undefined)
            progress.watchTime = watchTime;
        if (videoProgress !== undefined)
            progress.videoProgress = videoProgress;
        if (completed !== undefined)
            progress.completed = completed;
        if (lastPosition !== undefined)
            progress.lastPosition = lastPosition;
    }
    // 3. Mark completion date
    if (completed === true && !progress.completedAt) {
        progress.completedAt = new Date();
    }
    else if (completed === false) {
        progress.completed = false;
        progress.completedAt = undefined;
    }
    await progress.save();
    // 4. Check if course completion is achieved
    if (completed === true) {
        const totalLessonsCount = await lesson_model_1.Lesson.countDocuments({ courseId });
        const completedLessonsCount = await progress_model_1.Progress.countDocuments({
            studentId,
            courseId,
            completed: true,
        });
        if (totalLessonsCount > 0 && completedLessonsCount === totalLessonsCount) {
            // Mark enrollment as completed automatically
            await enrollment_model_1.Enrollment.updateOne({ studentId, courseId }, {
                status: 'Completed',
                completedAt: new Date(),
                certificateIssued: true,
            });
        }
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, progress, 'Progress updated successfully'));
});
/**
 * Get student progress for a course.
 */
exports.getCourseProgress = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { courseId } = req.params;
    let studentId = req.user?._id;
    if (!studentId) {
        throw new ApiError_1.ApiError(401, 'Unauthorized');
    }
    // Support teachers/admins querying any student's progress
    if (req.user && ['SUPER_ADMIN', 'ADMIN', 'TEACHER'].includes(req.user.role)) {
        if (req.query.studentId) {
            studentId = req.query.studentId;
        }
    }
    // Verify enrollment exists
    const enrollment = await enrollment_model_1.Enrollment.findOne({ studentId, courseId });
    if (!enrollment) {
        throw new ApiError_1.ApiError(403, 'User is not enrolled in this course');
    }
    // Calculate completion percentage
    const totalLessons = await lesson_model_1.Lesson.countDocuments({ courseId });
    const completedLessons = await progress_model_1.Progress.countDocuments({
        studentId,
        courseId,
        completed: true,
    });
    const completionPercentage = totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;
    const progressLogs = await progress_model_1.Progress.find({ studentId, courseId })
        .populate('lessonId', 'title slug lessonType duration order');
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        completionPercentage,
        completedLessons,
        totalLessons,
        progressLogs,
    }, 'Course progress retrieved successfully'));
});
/**
 * Get student achievements — XP, Level, Streak, and Badges.
 * Computes real data from Progress, Enrollment, and ExamAttempt records.
 */
exports.getStudentAchievements = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const studentId = req.user?._id;
    if (!studentId)
        throw new ApiError_1.ApiError(401, 'Unauthorized');
    // ── Parallel DB queries ────────────────────────────────────────────────────
    const [completedLessons, enrollments, examAttempts, allProgress, congratulationsRaw] = await Promise.all([
        progress_model_1.Progress.countDocuments({ studentId, completed: true }),
        enrollment_model_1.Enrollment.find({ studentId }).lean(),
        examAttempt_model_1.ExamAttempt.find({ studentId, status: { $in: ['Submitted', 'Graded'] } }).lean(),
        progress_model_1.Progress.find({ studentId, completed: true }).sort({ completedAt: -1 }).select('completedAt courseId').lean(),
        notification_model_1.Notification.find({
            recipientId: studentId,
            $or: [
                { type: { $in: ['Quiz', 'Exam'] } },
                { title: { $regex: /تهانينا|تهنئة|تفوق/i } },
            ],
        })
            .populate('senderId', 'firstName lastName avatar email')
            .sort({ createdAt: -1 })
            .limit(10)
            .lean(),
    ]);
    const activeEnrollments = enrollments.filter((e) => e.status === 'Active').length;
    const completedCourses = enrollments.filter((e) => e.status === 'Completed' || e.certificateIssued).length;
    const totalEnrollments = enrollments.length;
    const passedAttempts = examAttempts.filter((a) => a.passed).length;
    // ── XP Calculation ────────────────────────────────────────────────────────
    // Each completed lesson = 100 XP, completed course = 500 XP, exam attempt = 50 XP, teacher honor = 500 XP
    const xpFromLessons = completedLessons * 100;
    const xpFromCourses = completedCourses * 500;
    const xpFromAttempts = examAttempts.length * 50;
    const xpFromEnrollments = totalEnrollments * 50; // bonus for joining courses
    const xpFromTeacherHonors = congratulationsRaw.length * 500; // bonus for teacher honors & congratulations
    const totalXP = xpFromLessons + xpFromCourses + xpFromAttempts + xpFromEnrollments + xpFromTeacherHonors;
    const level = Math.max(1, Math.floor(totalXP / 500) + 1);
    // ── Streak Calculation ─────────────────────────────────────────────────────
    // Count consecutive days with at least one completed lesson (working backwards)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Build a Set of unique day strings (YYYY-MM-DD) from completion records
    const activeDaysSet = new Set();
    allProgress.forEach((p) => {
        if (p.completedAt) {
            const d = new Date(p.completedAt);
            activeDaysSet.add(d.toISOString().split('T')[0]);
        }
    });
    let streakDays = 0;
    let checkedDate = new Date(today);
    for (let i = 0; i < 365; i++) {
        const key = checkedDate.toISOString().split('T')[0];
        if (activeDaysSet.has(key)) {
            streakDays++;
            checkedDate.setDate(checkedDate.getDate() - 1);
        }
        else {
            // Allow skipping today if student hasn't studied yet today
            if (i === 0) {
                checkedDate.setDate(checkedDate.getDate() - 1);
                continue;
            }
            break;
        }
    }
    // ── Weekly Activity Map (current week Sat → Fri) ──────────────────────────
    const weekActivity = Array(7).fill(false);
    const todayDay = today.getDay(); // 0=Sun, 6=Sat
    // Build week starting from Saturday (6)
    for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        // Calculate offset: index 0=Sat, 1=Sun, ..., 6=Fri
        const dayOffset = ((todayDay - 6 + 7) % 7); // days since last Saturday
        d.setDate(today.getDate() - dayOffset + i);
        if (d > today)
            break;
        weekActivity[i] = activeDaysSet.has(d.toISOString().split('T')[0]);
    }
    const checkedInToday = activeDaysSet.has(today.toISOString().split('T')[0]);
    // ── Badges — Purely DB-Driven from Teacher Grants & Honors ──────────────────
    // ── Badges — Purely DB-Driven from Teacher Grants & Honors ──────────────────
    const badgesMap = new Map();
    // Process notifications from oldest to newest so latest status wins
    const sortedNotifications = [...congratulationsRaw].reverse();
    sortedNotifications.forEach((n) => {
        if (!n.title)
            return;
        const isLock = n.title.includes('🔒') || n.title.includes('غلق') || (n.title.includes('تحديث حالة') && !n.title.includes('منحك'));
        const isGrant = n.title.includes('🎖️') || n.title.includes('منحك') || n.title.includes('تهانينا') || n.title.includes('تفوق');
        // Extract badge name from quotes if present, otherwise clean title
        const match = n.title.match(/["'](.*?)["']/);
        let badgeTitle = match ? match[1] : n.title.replace(/^[🎖️🔒🎉\s]+/, '').trim();
        if (!badgeTitle)
            return;
        const teacherName = n.senderId && typeof n.senderId === 'object'
            ? `المعلم: ${n.senderId.firstName || ''} ${n.senderId.lastName || ''}`.trim()
            : 'معلم المادة';
        const description = n.message
            ? `${n.message} (${teacherName})`
            : `وسام تقديري ممنوح لك لتفوقك وأدائك العالي. (${teacherName})`;
        badgesMap.set(badgeTitle, {
            id: `badge-${n._id}`,
            title: badgeTitle,
            description: description,
            icon: isLock ? 'Lock' : (badgeTitle.includes('برمجة') || badgeTitle.includes('CS') ? 'Code2' : 'Trophy'),
            category: 'quiz',
            xpReward: 500,
            unlocked: isGrant && !isLock,
            unlockedAt: (isGrant && !isLock && n.createdAt) ? new Date(n.createdAt).toLocaleDateString('ar-EG') : undefined,
            progressPercentage: (isGrant && !isLock) ? 100 : 0,
        });
    });
    const badges = Array.from(badgesMap.values());
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        xp: {
            total: totalXP,
            fromLessons: xpFromLessons,
            fromCourses: xpFromCourses,
            fromAttempts: xpFromAttempts,
        },
        level,
        nextLevelXP: level * 500,
        streak: {
            currentStreak: streakDays,
            checkedInToday,
            weekActivity,
        },
        stats: {
            completedLessons,
            completedCourses,
            totalEnrollments,
            activeEnrollments,
            totalExamAttempts: examAttempts.length,
            passedAttempts,
        },
        congratulations: congratulationsRaw.map((n) => ({
            _id: n._id,
            title: n.title,
            message: n.message,
            type: n.type,
            priority: n.priority,
            createdAt: n.createdAt,
            sender: n.senderId && typeof n.senderId === 'object' ? {
                _id: n.senderId._id,
                firstName: n.senderId.firstName || '',
                lastName: n.senderId.lastName || '',
                avatar: n.senderId.avatar || '',
            } : null,
        })),
        badges,
    }, 'تم جلب بيانات الإنجازات بنجاح'));
});
/**
 * Daily Check-In — records today's activity by creating/updating a dummy progress entry.
 * Returns updated streak count and XP reward.
 */
exports.dailyCheckIn = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const studentId = req.user?._id;
    if (!studentId)
        throw new ApiError_1.ApiError(401, 'Unauthorized');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    // Check if already checked in today by looking at any progress record updated today
    const alreadyCheckedIn = await progress_model_1.Progress.findOne({
        studentId,
        completed: true,
        completedAt: { $gte: today, $lt: tomorrow },
    });
    if (alreadyCheckedIn) {
        throw new ApiError_1.ApiError(400, 'لقد قمت بتسجيل حضور اليوم بالفعل!');
    }
    // Find an active enrollment to attach the check-in to
    const enrollment = await enrollment_model_1.Enrollment.findOne({ studentId, status: 'Active' });
    if (!enrollment) {
        throw new ApiError_1.ApiError(400, 'يجب الاشتراك في كورس أولاً قبل تسجيل الحضور');
    }
    // Find any lesson from that enrollment's course to attach progress
    const lesson = await lesson_model_1.Lesson.findOne({ courseId: enrollment.courseId }).lean();
    if (!lesson) {
        throw new ApiError_1.ApiError(400, 'لا توجد دروس متاحة للتسجيل');
    }
    // Upsert a progress record for today
    await progress_model_1.Progress.findOneAndUpdate({ studentId, lessonId: lesson._id }, {
        studentId,
        courseId: enrollment.courseId,
        lessonId: lesson._id,
        completed: true,
        completedAt: new Date(),
        videoProgress: 100,
    }, { upsert: true, new: true });
    // Recalculate streak after check-in
    const allProgress = await progress_model_1.Progress.find({ studentId, completed: true })
        .sort({ completedAt: -1 })
        .select('completedAt')
        .lean();
    const activeDaysSet = new Set();
    allProgress.forEach((p) => {
        if (p.completedAt) {
            activeDaysSet.add(new Date(p.completedAt).toISOString().split('T')[0]);
        }
    });
    let streakDays = 0;
    const startDay = new Date();
    startDay.setHours(0, 0, 0, 0);
    let checkedDate = new Date(startDay);
    for (let i = 0; i < 365; i++) {
        const key = checkedDate.toISOString().split('T')[0];
        if (activeDaysSet.has(key)) {
            streakDays++;
            checkedDate.setDate(checkedDate.getDate() - 1);
        }
        else {
            break;
        }
    }
    const XP_CHECKIN_REWARD = 50;
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        xpEarned: XP_CHECKIN_REWARD,
        streakDays,
        checkedInToday: true,
        message: `تم تسجيل حضور اليوم! (+${XP_CHECKIN_REWARD} XP)`,
    }, 'تم تسجيل الحضور اليومي بنجاح'));
});
