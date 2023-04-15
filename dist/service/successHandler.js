"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successHandler = void 0;
const successHandler = (res, message, data, statusCode = 200) => {
    res.status(statusCode).json({
        status: 'success',
        message: message,
        data: data,
    });
};
exports.successHandler = successHandler;
//# sourceMappingURL=successHandler.js.map