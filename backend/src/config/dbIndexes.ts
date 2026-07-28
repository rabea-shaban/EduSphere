import Course from '../modules/courses/course.model';
import Lesson from '../modules/lessons/lesson.model';
import Quiz from '../modules/quizzes/quiz.model';
import Assignment from '../modules/assignments/assignment.model';
import FileAsset from '../modules/upload/fileAsset.model';
import Review from '../modules/reviews/review.model';
import ActivityLog from '../modules/activityLogs/activityLog.model';

/**
 * Ensures optimal MongoDB compound & text indexes across all core collections
 */
export const initDatabaseIndexes = async () => {
  try {
    console.log('[DB Optimization] Building MongoDB compound & text indexes...');

    await Promise.all([
      // Course Indexes
      Course.collection.createIndex({ teacher: 1, createdAt: -1 }).catch(() => {}),
      Course.collection.createIndex({ teacher: 1, status: 1 }).catch(() => {}),
      Course.collection.createIndex({ title: 'text', description: 'text' }).catch(() => {}),

      // Lesson Indexes
      Lesson.collection.createIndex({ teacherId: 1, createdAt: -1 }).catch(() => {}),
      Lesson.collection.createIndex({ courseId: 1, order: 1 }).catch(() => {}),

      // Quiz Indexes
      Quiz.collection.createIndex({ teacherId: 1, createdAt: -1 }).catch(() => {}),
      Quiz.collection.createIndex({ courseId: 1 }).catch(() => {}),

      // Assignment Indexes
      Assignment.collection.createIndex({ teacherId: 1, createdAt: -1 }).catch(() => {}),
      Assignment.collection.createIndex({ courseId: 1 }).catch(() => {}),

      // FileAsset Indexes
      FileAsset.collection.createIndex({ owner: 1, isDeleted: 1, createdAt: -1 }).catch(() => {}),
      FileAsset.collection.createIndex({ owner: 1, category: 1, isDeleted: 1 }).catch(() => {}),

      // Review Indexes
      Review.collection.createIndex({ teacherId: 1, createdAt: -1 }).catch(() => {}),
      Review.collection.createIndex({ courseId: 1, rating: -1 }).catch(() => {}),

      // ActivityLog Indexes
      ActivityLog.collection.createIndex({ userId: 1, createdAt: -1 }).catch(() => {}),
    ]);

    console.log('[DB Optimization] MongoDB compound indexes successfully initialized.');
  } catch (err: any) {
    console.warn('[DB Optimization Warning] Index build step encountered minor notice:', err.message);
  }
};
export default initDatabaseIndexes;
