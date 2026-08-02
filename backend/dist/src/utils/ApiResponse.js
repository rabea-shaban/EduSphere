"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
/**
 * Standard API Response structure.
 */
class ApiResponse {
    success;
    statusCode;
    message;
    data;
    constructor(statusCode, data, message = 'Success') {
        this.statusCode = statusCode;
        this.success = statusCode < 400;
        this.message = message;
        if (data !== undefined) {
            this.data = data;
        }
    }
}
exports.ApiResponse = ApiResponse;
