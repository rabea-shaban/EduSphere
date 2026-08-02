"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportPaymentsReport = exports.getReportsSummary = void 0;
const payment_model_1 = require("../payments/payment.model");
const user_model_1 = require("../users/user.model");
const course_model_1 = require("../courses/course.model");
const ApiResponse_1 = require("../../utils/ApiResponse");
const catchAsync_1 = require("../../utils/catchAsync");
/**
 * Get summaries of reports.
 */
exports.getReportsSummary = (0, catchAsync_1.catchAsync)(async (_req, res) => {
    const totalPayments = await payment_model_1.Payment.countDocuments({});
    const totalStudents = await user_model_1.User.countDocuments({ role: 'STUDENT' });
    const totalCourses = await course_model_1.Course.countDocuments({});
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        totalPayments,
        totalStudents,
        totalCourses,
    }, 'Reports summary retrieved successfully'));
});
/**
 * Export Payments History as an Excel-compatible CSV sheet.
 */
exports.exportPaymentsReport = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { startDate, endDate } = req.query;
    const filter = {};
    if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate)
            filter.createdAt.$gte = new Date(startDate);
        if (endDate)
            filter.createdAt.$lte = new Date(endDate);
    }
    const payments = await payment_model_1.Payment.find(filter)
        .populate('studentId', 'firstName lastName email')
        .populate('courseId', 'title')
        .sort({ createdAt: -1 });
    // Compile CSV Columns
    let csvContent = 'Payment ID,Student Name,Student Email,Course Title,Amount,Currency,Status,Paid At,Created At\n';
    for (const payment of payments) {
        const studentName = payment.studentId
            ? `${payment.studentId.firstName} ${payment.studentId.lastName}`
            : 'N/A';
        const studentEmail = payment.studentId ? payment.studentId.email : 'N/A';
        const courseTitle = payment.courseId ? payment.courseId.title.replace(/,/g, ' ') : 'N/A';
        const paidAt = payment.paidAt ? payment.paidAt.toISOString() : 'N/A';
        const createdAt = payment.createdAt ? payment.createdAt.toISOString() : 'N/A';
        csvContent += `"${payment._id}","${studentName}","${studentEmail}","${courseTitle}",${payment.amount},"${payment.currency}","${payment.status}","${paidAt}","${createdAt}"\n`;
    }
    // Set file headers and transmit CSV payload
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=payments-report-${Date.now()}.csv`);
    res.status(200).send(csvContent);
});
exports.default = exports.getReportsSummary;
