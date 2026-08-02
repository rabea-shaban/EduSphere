"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const mongoose_1 = require("mongoose");
const course_model_1 = __importDefault(require("../courses/course.model"));
const lesson_model_1 = __importDefault(require("../lessons/lesson.model"));
const quiz_model_1 = __importDefault(require("../quizzes/quiz.model"));
const assignment_model_1 = __importDefault(require("../assignments/assignment.model"));
const fileAsset_model_1 = __importDefault(require("../upload/fileAsset.model"));
const review_model_1 = __importDefault(require("../reviews/review.model"));
const activityLog_model_1 = __importDefault(require("../activityLogs/activityLog.model"));
const user_model_1 = __importDefault(require("../users/user.model"));
const enrollment_model_1 = __importDefault(require("../enrollments/enrollment.model"));
class SearchService {
    static parseId(id) {
        return typeof id === 'string' ? new mongoose_1.Types.ObjectId(id) : id;
    }
    /**
     * Perform Global Multi-Module Search for Teacher Dashboard
     */
    static async globalSearch(teacherIdInput, keyword, reqInfo) {
        if (!keyword || keyword.trim().length === 0) {
            return {
                courses: [],
                lessons: [],
                quizzes: [],
                assignments: [],
                students: [],
                files: [],
                reviews: [],
                totalMatches: 0,
            };
        }
        const teacherId = this.parseId(teacherIdInput);
        const cleanKeyword = keyword.trim();
        const fullRegex = new RegExp(cleanKeyword, 'i');
        const keywords = cleanKeyword.split(/\s+/);
        const regexes = keywords.map((k) => new RegExp(k, 'i'));
        // Get distinct enrolled student IDs for this teacher
        const enrolledStudentIds = await enrollment_model_1.default.find({ teacherId: teacherId }).distinct('studentId');
        const studentFilter = {
            $or: [
                { firstName: fullRegex },
                { lastName: fullRegex },
                { email: fullRegex },
                { phone: fullRegex },
                { username: fullRegex },
                ...(regexes.length > 1
                    ? [{ $and: regexes.map((r) => ({ $or: [{ firstName: r }, { lastName: r }, { email: r }, { username: r }] })) }]
                    : []),
            ],
        };
        if (enrolledStudentIds.length > 0) {
            studentFilter._id = { $in: enrolledStudentIds };
        }
        else {
            studentFilter.role = 'STUDENT';
        }
        const [courses, lessons, quizzes, assignments, students, files, reviews] = await Promise.all([
            // Courses
            course_model_1.default.find({
                teacher: teacherId,
                $or: [{ title: fullRegex }, { description: fullRegex }, { category: fullRegex }, { level: fullRegex }],
            })
                .select('title slug coverImage category status level price')
                .limit(5)
                .lean(),
            // Lessons
            lesson_model_1.default.find({
                teacherId: teacherId,
                $or: [{ title: fullRegex }, { content: fullRegex }, { summary: fullRegex }],
            })
                .select('title courseId duration isFree')
                .limit(5)
                .lean(),
            // Quizzes
            quiz_model_1.default.find({
                teacherId: teacherId,
                $or: [{ title: fullRegex }, { description: fullRegex }],
            })
                .select('title courseId totalMarks durationMinutes')
                .limit(5)
                .lean(),
            // Assignments
            assignment_model_1.default.find({
                teacherId: teacherId,
                $or: [{ title: fullRegex }, { description: fullRegex }],
            })
                .select('title courseId totalPoints dueDate')
                .limit(5)
                .lean(),
            // Students
            user_model_1.default.find(studentFilter)
                .select('firstName lastName email avatar phone username')
                .limit(5)
                .lean(),
            // Files
            fileAsset_model_1.default.find({
                owner: teacherId,
                isDeleted: false,
                $or: [{ originalName: fullRegex }, { folder: fullRegex }, { extension: fullRegex }],
            })
                .select('originalName secureUrl fileSize extension category folder')
                .limit(5)
                .lean(),
            // Reviews
            review_model_1.default.find({ teacherId: teacherId, comment: fullRegex })
                .select('rating comment user courseId createdAt')
                .limit(5)
                .lean(),
        ]);
        const totalMatches = courses.length +
            lessons.length +
            quizzes.length +
            assignments.length +
            students.length +
            files.length +
            reviews.length;
        // Audit log search
        await activityLog_model_1.default.create({
            userId: teacherId,
            userName: reqInfo.userName,
            userRole: reqInfo.userRole || 'TEACHER',
            action: `بحث عالمي بكلمة: "${keyword}" (النتائج: ${totalMatches})`,
            category: 'Settings',
            module: 'SearchEngine',
            status: 'SUCCESS',
            ipAddress: reqInfo.ipAddress,
            userAgent: reqInfo.userAgent,
        }).catch(() => { });
        return {
            courses: courses.map((c) => ({
                id: c._id.toString(),
                title: c.title,
                subtitle: `كورس • ${c.category || 'عام'}`,
                thumbnail: c.coverImage,
                url: `/teacher/courses/${c._id}`,
                type: 'course',
            })),
            lessons: lessons.map((l) => ({
                id: l._id.toString(),
                title: l.title,
                subtitle: `درس • مدة ${l.duration || 0} دقيقة`,
                url: `/teacher/lessons`,
                type: 'lesson',
            })),
            quizzes: quizzes.map((q) => ({
                id: q._id.toString(),
                title: q.title,
                subtitle: `اختبار • ${q.totalMarks || 0} درجة`,
                url: `/teacher/quizzes`,
                type: 'quiz',
            })),
            assignments: assignments.map((a) => ({
                id: a._id.toString(),
                title: a.title,
                subtitle: `واجب • ${a.totalPoints || 0} نقطة`,
                url: `/teacher/assignments`,
                type: 'assignment',
            })),
            students: students.map((s) => ({
                id: s._id.toString(),
                title: `${s.firstName} ${s.lastName}`,
                subtitle: `طالب • ${s.email || s.phone || s.username || ''}`,
                thumbnail: s.avatar,
                url: `/teacher/students?search=${encodeURIComponent(`${s.firstName} ${s.lastName}`)}`,
                type: 'student',
            })),
            files: files.map((f) => ({
                id: f._id.toString(),
                title: f.originalName,
                subtitle: `ملف • ${f.extension?.toUpperCase() || 'FILE'} • ${f.folder}`,
                thumbnail: f.category === 'image' ? f.secureUrl : undefined,
                url: `/teacher/files`,
                type: 'file',
            })),
            reviews: reviews.map((r) => ({
                id: r._id.toString(),
                title: r.comment || 'تقييم بدون تعليق',
                subtitle: `تقييم • ${r.rating} نجوم`,
                url: `/teacher/reviews`,
                type: 'review',
            })),
            totalMatches,
        };
    }
    /**
     * Quick autocomplete search suggestions
     */
    static async getSuggestions(teacherIdInput, keyword) {
        if (!keyword || keyword.trim().length < 2)
            return [];
        const teacherId = this.parseId(teacherIdInput);
        const searchRegex = new RegExp(`^${keyword.trim()}`, 'i');
        const enrolledStudentIds = await enrollment_model_1.default.find({ teacherId: teacherId }).distinct('studentId');
        const studentFilter = {
            $or: [{ firstName: searchRegex }, { lastName: searchRegex }, { email: searchRegex }],
        };
        if (enrolledStudentIds.length > 0)
            studentFilter._id = { $in: enrolledStudentIds };
        else
            studentFilter.role = 'STUDENT';
        const [courses, files, students] = await Promise.all([
            course_model_1.default.find({ teacher: teacherId, title: searchRegex }).select('title').limit(4).lean(),
            fileAsset_model_1.default.find({ owner: teacherId, isDeleted: false, originalName: searchRegex }).select('originalName').limit(4).lean(),
            user_model_1.default.find(studentFilter).select('firstName lastName').limit(4).lean(),
        ]);
        const suggestions = new Set();
        courses.forEach((c) => suggestions.add(c.title));
        files.forEach((f) => suggestions.add(f.originalName));
        students.forEach((s) => suggestions.add(`${s.firstName} ${s.lastName}`));
        return Array.from(suggestions).slice(0, 8);
    }
}
exports.SearchService = SearchService;
