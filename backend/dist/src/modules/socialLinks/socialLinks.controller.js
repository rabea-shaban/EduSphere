"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSocialLinks = exports.getSocialLinks = void 0;
const socialLinks_model_1 = require("./socialLinks.model");
const ApiResponse_1 = require("../../utils/ApiResponse");
const catchAsync_1 = require("../../utils/catchAsync");
exports.getSocialLinks = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { organizationId } = req.query;
    const filter = {};
    if (organizationId)
        filter.organizationId = organizationId;
    let links = await socialLinks_model_1.SocialLinks.findOne(filter);
    if (!links) {
        links = await socialLinks_model_1.SocialLinks.create({ facebook: '' });
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, links, 'Social links retrieved successfully'));
});
exports.updateSocialLinks = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { organizationId } = req.query;
    const filter = {};
    if (organizationId)
        filter.organizationId = organizationId;
    let links = await socialLinks_model_1.SocialLinks.findOne(filter);
    if (!links) {
        links = new socialLinks_model_1.SocialLinks();
    }
    Object.assign(links, req.body);
    await links.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, links, 'Social links updated successfully'));
});
