"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const postsControllers_1 = require("../controllers/postsControllers");
const auth_1 = require("../service/auth");
const router = express_1.default.Router();
router.get('/', postsControllers_1.getPosts);
router.post('/', auth_1.isAuth, postsControllers_1.createPost);
router.patch('/:id', auth_1.isAuth, postsControllers_1.editPost);
router.delete('/:id', auth_1.isAuth, postsControllers_1.delPost);
exports.default = router;
//# sourceMappingURL=posts.js.map