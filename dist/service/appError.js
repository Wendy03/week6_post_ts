"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appError = void 0;
const appError = (httpStatus, errMessage, next) => {
    const error = new Error(errMessage);
    error.statusCode = httpStatus;
    error.isOperational = true;
    next(error);
};
exports.appError = appError;
//# sourceMappingURL=appError.js.map