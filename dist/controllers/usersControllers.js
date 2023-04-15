"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.editUser = exports.getUser = exports.signin = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const validator_1 = __importDefault(require("validator"));
const appError_1 = require("../service/appError");
const auth_1 = require("../service/auth");
const handleErrorAsync_1 = require("../service/handleErrorAsync");
const successHandler_1 = require("../service/successHandler");
const usersModel_1 = require("../models/usersModel");
const passwordRule = /^([a-zA-Z]+\d+|\d+[a-zA-Z]+)[a-zA-Z0-9]*$/;
exports.signup = (0, handleErrorAsync_1.handleErrorAsync)(async (req, res, next) => {
    let { name, email, password, photo } = req.body;
    const findUser = await usersModel_1.User.findOne({ email });
    const errMsgAry = [];
    if (!name || !email || !password) {
        return (0, appError_1.appError)(400, '欄位未填寫正確', next);
    }
    if (findUser) {
        return (0, appError_1.appError)(400, '此 E-mail 已經註冊', next);
    }
    if (!validator_1.default.isLength(name, { min: 2 })) {
        errMsgAry.push('暱稱至少 2 個字元以上');
    }
    if (!validator_1.default.isLength(password, { min: 8 })) {
        errMsgAry.push('密碼需至少 8 碼以上');
    }
    if (!passwordRule.test(password)) {
        errMsgAry.push('密碼需英數混合的驗證');
    }
    if (!validator_1.default.isEmail(email)) {
        errMsgAry.push('Email 格式不正確');
    }
    if (errMsgAry.length > 0) {
        return (0, appError_1.appError)(400, errMsgAry.join(''), next);
    }
    password = await bcryptjs_1.default.hash(req.body.password, 12);
    const newUser = await usersModel_1.User.create({
        email,
        password,
        name,
        photo,
    });
    (0, auth_1.generateSendJWT)(newUser, 201, res);
});
exports.signin = (0, handleErrorAsync_1.handleErrorAsync)(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return (0, appError_1.appError)(400, '帳號密碼不可為空', next);
    }
    const user = await usersModel_1.User.findOne({ email }).select('+password');
    const auth = await bcryptjs_1.default.compare(password, user.password);
    if (!auth || !user) {
        return (0, appError_1.appError)(400, '帳號或密碼錯誤，請重新輸入！', next);
    }
    (0, auth_1.generateSendJWT)(user, 200, res);
});
exports.getUser = (0, handleErrorAsync_1.handleErrorAsync)(async (req, res, next) => {
    (0, successHandler_1.successHandler)(res, '取得資料', req.user);
});
exports.editUser = (0, handleErrorAsync_1.handleErrorAsync)(async (req, res, next) => {
    const { name, gender, photo } = req.body;
    if (!name) {
        return (0, appError_1.appError)(400, '欄位資料填寫不全', next);
    }
    else {
        const editUser = await usersModel_1.User.findByIdAndUpdate(req.user.id, {
            name,
            gender,
            photo,
        }, { new: true });
        if (!editUser) {
            return (0, appError_1.appError)(400, '編輯失敗', next);
        }
        else {
            const user = await usersModel_1.User.findById(req.user.id);
            (0, successHandler_1.successHandler)(res, '編輯成功', user);
        }
    }
});
exports.updatePassword = (0, handleErrorAsync_1.handleErrorAsync)(async (req, res, next) => {
    let { password, confirmPassword } = req.body;
    const errMsgAry = [];
    if (!validator_1.default.isLength(password, { min: 8 })) {
        errMsgAry.push('密碼需至少 8 碼以上');
    }
    if (password !== confirmPassword) {
        errMsgAry.push('密碼不一致！');
    }
    if (!passwordRule.test(password)) {
        errMsgAry.push('密碼需英數混合的驗證');
    }
    if (errMsgAry.length > 0) {
        return (0, appError_1.appError)(400, errMsgAry.join(''), next);
    }
    password = await bcryptjs_1.default.hash(password, 12);
    const user = await usersModel_1.User.findByIdAndUpdate(req.user.id, {
        password,
    }, { new: true });
    (0, successHandler_1.successHandler)(res, '密碼更新成功', user);
});
//# sourceMappingURL=usersControllers.js.map