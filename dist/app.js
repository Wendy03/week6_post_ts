"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const resError_1 = __importDefault(require("./service/resError"));
const posts_1 = __importDefault(require("./routes/posts"));
const users_1 = __importDefault(require("./routes/users"));
const app = (0, express_1.default)();
require('./connections');
require('./service/process');
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use('/users', users_1.default);
app.use('/posts', posts_1.default);
app.use((req, res, next) => {
    res.status(404).json({
        status: 'error',
        message: '無此路由資訊',
    });
});
app.use((err, req, res, next) => {
    // dev
    err.statusCode = err.statusCode || 500;
    if (process.env.NODE_ENV === 'dev') {
        resError_1.default.resErrorDev(err, res);
    }
    // production
    if (err.name === 'ValidationError') {
        err.message = '資料欄位未填寫正確，請重新輸入！';
        err.isOperational = true;
        resError_1.default.resErrorProd(err, res);
    }
    resError_1.default.resErrorProd(err, res);
});
exports.default = app;
//# sourceMappingURL=app.js.map