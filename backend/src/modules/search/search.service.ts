import { Types } from 'mongoose';
import Course from '../courses/course.model';
import Lesson from '../lessons/lesson.model';
import Quiz from '../quizzes/quiz.model';
import Assignment from '../assignments/assignment.model';
import FileAsset from '../upload/fileAsset.model';
import Review from '../reviews/review.model';
import ActivityLog from '../activityLogs/activityLog.model';
import User from '../users/user.model';
import Enrollment from '../enrollments/enrollment.model';

interface IReqInfo {
  ipAddress?: string;
  userAgent?: string;
  userName?: string;
  userRole?: string;
}

export class SearchService {
  private static parseId(id: any): Types.ObjectId {
    return typeof id === 'string' ? new Types.ObjectId(id) : id;
  }

  /**
   * Perform Global Multi-Module Search for Teacher Dashboard
   */
  static async globalSearch(teacherIdInput: any, keyword: string, reqInfo: IReqInfo) {
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
    const enrolledStudentIds = await Enrollment.find({ teacherId: teacherId as any }).distinct('studentId');

    const studentFilter: any = {
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
    } else {
      studentFilter.role = 'STUDENT';
    }

    const [courses, lessons, quizzes, assignments, students, files, reviews] = await Promise.all([
      // Courses
      Course.find({
        teacher: teacherId as any,
        $or: [{ title: fullRegex }, { description: fullRegex }, { category: fullRegex }, { level: fullRegex }],
      })
        .select('title slug coverImage category status level price')
        .limit(5)
        .lean(),

      // Lessons
      Lesson.find({
        teacherId: teacherId as any,
        $or: [{ title: fullRegex }, { content: fullRegex }, { summary: fullRegex }],
      })
        .select('title courseId duration isFree')
        .limit(5)
        .lean(),

      // Quizzes
      Quiz.find({
        teacherId: teacherId as any,
        $or: [{ title: fullRegex }, { description: fullRegex }],
      })
        .select('title courseId totalMarks durationMinutes')
        .limit(5)
        .lean(),

      // Assignments
      Assignment.find({
        teacherId: teacherId as any,
        $or: [{ title: fullRegex }, { description: fullRegex }],
      })
        .select('title courseId totalPoints dueDate')
        .limit(5)
        .lean(),

      // Students
      User.find(studentFilter)
        .select('firstName lastName email avatar phone username')
        .limit(5)
        .lean(),

      // Files
      FileAsset.find({
        owner: teacherId as any,
        isDeleted: false,
        $or: [{ originalName: fullRegex }, { folder: fullRegex }, { extension: fullRegex }],
      })
        .select('originalName secureUrl fileSize extension category folder')
        .limit(5)
        .lean(),

      // Reviews
      Review.find({ teacherId: teacherId as any, comment: fullRegex })
        .select('rating comment user courseId createdAt')
        .limit(5)
        .lean(),
    ]);

    const totalMatches =
      courses.length +
      lessons.length +
      quizzes.length +
      assignments.length +
      students.length +
      files.length +
      reviews.length;

    // Audit log search
    await ActivityLog.create({
      userId: teacherId as any,
      userName: reqInfo.userName,
      userRole: reqInfo.userRole || 'TEACHER',
      action: `بحث عالمي بكلمة: "${keyword}" (النتائج: ${totalMatches})`,
      category: 'Settings',
      module: 'SearchEngine',
      status: 'SUCCESS',
      ipAddress: reqInfo.ipAddress,
      userAgent: reqInfo.userAgent,
    } as any).catch(() => {});

    return {
      courses: courses.map((c: any) => ({
        id: c._id.toString(),
        title: c.title,
        subtitle: `كورس • ${c.category || 'عام'}`,
        thumbnail: c.coverImage,
        url: `/teacher/courses/${c._id}`,
        type: 'course',
      })),
      lessons: lessons.map((l: any) => ({
        id: l._id.toString(),
        title: l.title,
        subtitle: `درس • مدة ${l.duration || 0} دقيقة`,
        url: `/teacher/lessons`,
        type: 'lesson',
      })),
      quizzes: quizzes.map((q: any) => ({
        id: q._id.toString(),
        title: q.title,
        subtitle: `اختبار • ${q.totalMarks || 0} درجة`,
        url: `/teacher/quizzes`,
        type: 'quiz',
      })),
      assignments: assignments.map((a: any) => ({
        id: a._id.toString(),
        title: a.title,
        subtitle: `واجب • ${a.totalPoints || 0} نقطة`,
        url: `/teacher/assignments`,
        type: 'assignment',
      })),
      students: students.map((s: any) => ({
        id: s._id.toString(),
        title: `${s.firstName} ${s.lastName}`,
        subtitle: `طالب • ${s.email || s.phone || s.username || ''}`,
        thumbnail: s.avatar,
        url: `/teacher/students?search=${encodeURIComponent(`${s.firstName} ${s.lastName}`)}`,
        type: 'student',
      })),
      files: files.map((f: any) => ({
        id: f._id.toString(),
        title: f.originalName,
        subtitle: `ملف • ${f.extension?.toUpperCase() || 'FILE'} • ${f.folder}`,
        thumbnail: f.category === 'image' ? f.secureUrl : undefined,
        url: `/teacher/files`,
        type: 'file',
      })),
      reviews: reviews.map((r: any) => ({
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
  static async getSuggestions(teacherIdInput: any, keyword: string) {
    if (!keyword || keyword.trim().length < 2) return [];

    const teacherId = this.parseId(teacherIdInput);
    const searchRegex = new RegExp(`^${keyword.trim()}`, 'i');

    const enrolledStudentIds = await Enrollment.find({ teacherId: teacherId as any }).distinct('studentId');
    const studentFilter: any = {
      $or: [{ firstName: searchRegex }, { lastName: searchRegex }, { email: searchRegex }],
    };
    if (enrolledStudentIds.length > 0) studentFilter._id = { $in: enrolledStudentIds };
    else studentFilter.role = 'STUDENT';

    const [courses, files, students] = await Promise.all([
      Course.find({ teacher: teacherId as any, title: searchRegex }).select('title').limit(4).lean(),
      FileAsset.find({ owner: teacherId as any, isDeleted: false, originalName: searchRegex }).select('originalName').limit(4).lean(),
      User.find(studentFilter).select('firstName lastName').limit(4).lean(),
    ]);

    const suggestions = new Set<string>();
    courses.forEach((c: any) => suggestions.add(c.title));
    files.forEach((f: any) => suggestions.add(f.originalName));
    students.forEach((s: any) => suggestions.add(`${s.firstName} ${s.lastName}`));

    return Array.from(suggestions).slice(0, 8);
  }
}

