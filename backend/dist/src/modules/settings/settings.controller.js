"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGeneralSettings = exports.getGeneralSettings = void 0;
const settings_model_1 = require("./settings.model");
const ApiResponse_1 = require("../../utils/ApiResponse");
const catchAsync_1 = require("../../utils/catchAsync");
exports.getGeneralSettings = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { organizationId } = req.query;
    const filter = {};
    if (organizationId)
        filter.organizationId = organizationId;
    let settings = await settings_model_1.Settings.findOne(filter);
    if (!settings) {
        // Return empty default or create default
        settings = await settings_model_1.Settings.create({ organizationName: 'EduSphere Academy' });
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, settings, 'Settings retrieved successfully'));
});
exports.updateGeneralSettings = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { organizationId } = req.query;
    const filter = {};
    if (organizationId)
        filter.organizationId = organizationId;
    let settings = await settings_model_1.Settings.findOne(filter);
    if (!settings) {
        settings = new settings_model_1.Settings({ organizationName: req.body.organizationName || 'EduSphere Academy' });
    }
    Object.assign(settings, req.body);
    await settings.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, settings, 'Settings updated successfully'));
});
