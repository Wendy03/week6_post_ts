"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, '請輸入您的名字'],
    },
    email: {
        type: String,
        required: [true, '請輸入您的 Email'],
        unique: true,
        lowercase: true,
        select: false,
    },
    password: {
        type: String,
        required: [true, '密碼必填'],
        select: false,
    },
    gender: {
        type: String,
        default: 'male',
        enum: ['male', 'female'],
    },
    photo: String,
}, { versionKey: false });
exports.User = mongoose_1.default.model('User', userSchema);
//# sourceMappingURL=usersModel.js.map