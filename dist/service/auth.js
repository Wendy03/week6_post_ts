"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSendJWT = exports.isAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const usersModel_1 = require("../models/usersModel");
const appError_1 = require("../service/appError");
const handleErrorAsync_1 = require("../service/handleErrorAsync");
exports.isAuth = (0, handleErrorAsync_1.handleErrorAsync)(async (req, res, next) => {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next((0, appError_1.appError)(401, '你尚未登入！', next));
    }
    // 驗證 token 正確性
    const decoded = await new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, payload) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(payload);
            }
        });
    });
    const currentUser = await usersModel_1.User.findById(decoded.id);
    req.user = currentUser;
    next();
});
const generateSendJWT = (user, statusCode, res) => {
    // 產生 JWT token
    const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_DAY,
    });
    user.password = undefined;
    res.status(statusCode).json({
        status: 'success',
        user: {
            token,
            name: user.name,
        },
    });
};
exports.generateSendJWT = generateSendJWT;
//# sourceMappingURL=auth.js.map