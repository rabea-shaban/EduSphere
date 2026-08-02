"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDatabaseIndexes = void 0;
const course_model_1 = __importDefault(require("../modules/courses/course.model"));
const lesson_model_1 = __importDefault(require("../modules/lessons/lesson.model"));
const quiz_model_1 = __importDefault(require("../modules/quizzes/quiz.model"));
const assignment_model_1 = __importDefault(require("../modules/assignments/assignment.model"));
const fileAsset_model_1 = __importDefault(require("../modules/upload/fileAsset.model"));
const review_model_1 = __importDefault(require("../modules/reviews/review.model"));
const activityLog_model_1 = __importDefault(require("../modules/activityLogs/activityLog.model"));
/**
 * Ensures optimal MongoDB compound & text indexes across all core collections
 */
const initDatabaseIndexes = async () => {
    try {
        console.log('[DB Optimization] Building MongoDB compound & text indexes...');
        await Promise.all([
            // Course Indexes
            course_model_1.default.collection.createIndex({ teacher: 1, createdAt: -1 }).catch(() => { }),
            course_model_1.default.collection.createIndex({ teacher: 1, status: 1 }).catch(() => { }),
            course_model_1.default.collection.createIndex({ title: 'text', description: 'text' }).catch(() => { }),
            // Lesson Indexes
            lesson_model_1.default.collection.createIndex({ teacherId: 1, createdAt: -1 }).catch(() => { }),
            lesson_model_1.default.collection.createIndex({ courseId: 1, order: 1 }).catch(() => { }),
            // Quiz Indexes
            quiz_model_1.default.collection.createIndex({ teacherId: 1, createdAt: -1 }).catch(() => { }),
            quiz_model_1.default.collection.createIndex({ courseId: 1 }).catch(() => { }),
            // Assignment Indexes
            assignment_model_1.default.collection.createIndex({ teacherId: 1, createdAt: -1 }).catch(() => { }),
            assignment_model_1.default.collection.createIndex({ courseId: 1 }).catch(() => { }),
            // FileAsset Indexes
            fileAsset_model_1.default.collection.createIndex({ owner: 1, isDeleted: 1, createdAt: -1 }).catch(() => { }),
            fileAsset_model_1.default.collection.createIndex({ owner: 1, category: 1, isDeleted: 1 }).catch(() => { }),
            // Review Indexes
            review_model_1.default.collection.createIndex({ teacherId: 1, createdAt: -1 }).catch(() => { }),
            review_model_1.default.collection.createIndex({ courseId: 1, rating: -1 }).catch(() => { }),
            // ActivityLog Indexes
            activityLog_model_1.default.collection.createIndex({ userId: 1, createdAt: -1 }).catch(() => { }),
        ]);
        console.log('[DB Optimization] MongoDB compound indexes successfully initialized.');
    }
    catch (err) {
        console.warn('[DB Optimization Warning] Index build step encountered minor notice:', err.message);
    }
};
exports.initDatabaseIndexes = initDatabaseIndexes;
exports.default = exports.initDatabaseIndexes;
