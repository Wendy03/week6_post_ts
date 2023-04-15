"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usersControllers_1 = require("../controllers/usersControllers");
const auth_1 = require("../service/auth");
const router = express_1.default.Router();
router.post('/signup', usersControllers_1.signup);
router.post('/signin', usersControllers_1.signin);
router.get('/profile', auth_1.isAuth, usersControllers_1.getUser);
router.patch('/profile', auth_1.isAuth, usersControllers_1.editUser);
router.patch('/updatePassword', auth_1.isAuth, usersControllers_1.updatePassword);
exports.default = router;
//# sourceMappingURL=users.js.map