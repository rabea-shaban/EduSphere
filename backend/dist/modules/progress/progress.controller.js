"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCourseProgress = exports.updateProgress = void 0;
const progress_model_1 = require("./progress.model");
const enrollment_model_1 = require("../enrollments/enrollment.model");
const lesson_model_1 = require("../lessons/lesson.model");
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
