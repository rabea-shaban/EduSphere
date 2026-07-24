import { Request, Response } from 'express';
import { Payment } from '../payments/payment.model';
import { User } from '../users/user.model';
import { Course } from '../courses/course.model';
import { ApiResponse } from '../../utils/ApiResponse';
import { catchAsync } from '../../utils/catchAsync';

/**
 * Get summaries of reports.
 */
export const getReportsSummary = catchAsync(async (_req: Request, res: Response) => {
  const totalPayments = await Payment.countDocuments({});
  const totalStudents = await User.countDocuments({ role: 'STUDENT' });
  const totalCourses = await Course.countDocuments({});

  res.status(200).json(
    new ApiResponse(
      200,
      {
        totalPayments,
        totalStudents,
        totalCourses,
      },
      'Reports summary retrieved successfully'
    )
  );
});

/**
 * Export Payments History as an Excel-compatible CSV sheet.
 */
export const exportPaymentsReport = catchAsync(async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;
  const filter: any = {};

  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate as string);
    if (endDate) filter.createdAt.$lte = new Date(endDate as string);
  }

  const payments = await Payment.find(filter)
    .populate('studentId', 'firstName lastName email')
    .populate('courseId', 'title')
    .sort({ createdAt: -1 });

  // Compile CSV Columns
  let csvContent = 'Payment ID,Student Name,Student Email,Course Title,Amount,Currency,Status,Paid At,Created At\n';

  for (const payment of payments) {
    const studentName = payment.studentId
      ? `${(payment.studentId as any).firstName} ${(payment.studentId as any).lastName}`
      : 'N/A';
    const studentEmail = payment.studentId ? (payment.studentId as any).email : 'N/A';
    const courseTitle = payment.courseId ? (payment.courseId as any).title.replace(/,/g, ' ') : 'N/A';
    const paidAt = payment.paidAt ? payment.paidAt.toISOString() : 'N/A';
    const createdAt = payment.createdAt ? payment.createdAt.toISOString() : 'N/A';

    csvContent += `"${payment._id}","${studentName}","${studentEmail}","${courseTitle}",${payment.amount},"${payment.currency}","${payment.status}","${paidAt}","${createdAt}"\n`;
  }

  // Set file headers and transmit CSV payload
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=payments-report-${Date.now()}.csv`);
  res.status(200).send(csvContent);
});
export default getReportsSummary;
