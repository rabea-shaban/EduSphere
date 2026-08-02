"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateContactStatus = exports.getContactById = exports.getAllContacts = exports.submitContact = void 0;
const contact_model_1 = require("./contact.model");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
exports.submitContact = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const contact = await contact_model_1.Contact.create(req.body);
    res.status(201).json(new ApiResponse_1.ApiResponse(201, contact, 'Contact message submitted successfully'));
});
exports.getAllContacts = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page = 1, limit = 10, status } = req.query;
    const filter = {};
    if (status)
        filter.status = status;
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;
    const contacts = await contact_model_1.Contact.find(filter).skip(skip).limit(limitNum).sort({ createdAt: -1 });
    const total = await contact_model_1.Contact.countDocuments(filter);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { contacts, pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) } }, 'Contact queries retrieved successfully'));
});
exports.getContactById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const contact = await contact_model_1.Contact.findById(id);
    if (!contact)
        throw new ApiError_1.ApiError(404, 'Contact message not found');
    res.status(200).json(new ApiResponse_1.ApiResponse(200, contact, 'Contact message details retrieved'));
});
exports.updateContactStatus = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const contact = await contact_model_1.Contact.findByIdAndUpdate(id, { status: req.body.status }, { new: true });
    if (!contact)
        throw new ApiError_1.ApiError(404, 'Contact message not found');
    res.status(200).json(new ApiResponse_1.ApiResponse(200, contact, 'Contact status updated successfully'));
});
