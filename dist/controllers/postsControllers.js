"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delPost = exports.editPost = exports.createPost = exports.getPosts = void 0;
const postsModel_1 = require("../models/postsModel");
const appError_1 = require("../service/appError");
const handleErrorAsync_1 = require("../service/handleErrorAsync");
const successHandler_1 = require("../service/successHandler");
exports.getPosts = (0, handleErrorAsync_1.handleErrorAsync)(async (req, res, next) => {
    const { keyword, sortby } = req.query;
    const search = keyword !== undefined ? { content: new RegExp(`${keyword}`) } : {};
    const sort = sortby === 'asc' ? 'createdAt' : '-createdAt';
    const posts = await postsModel_1.Post.find(search)
        .populate({
        path: 'user',
        select: 'name photo',
    })
        .sort(sort);
    (0, successHandler_1.successHandler)(res, '取得貼文', posts);
});
exports.createPost = (0, handleErrorAsync_1.handleErrorAsync)(async (req, res, next) => {
    const { content, image } = req.body;
    if (content === undefined) {
        return (0, appError_1.appError)(400, 'content 必填', next);
    }
    const newPost = await postsModel_1.Post.create({
        user: req.user.id,
        content,
        image,
    });
    (0, successHandler_1.successHandler)(res, '貼文新增成功', newPost);
});
exports.editPost = (0, handleErrorAsync_1.handleErrorAsync)(async (req, res, next) => {
    const { content, image, likes } = req.body;
    const postId = req.params.id;
    const currentPost = await postsModel_1.Post.findById(postId).populate({
        path: 'user',
        select: 'name photo',
    });
    if (!currentPost) {
        return (0, appError_1.appError)(400, '查無此貼文', next);
    }
    if (content === undefined) {
        return (0, appError_1.appError)(400, 'content 必填', next);
    }
    const updatedPost = await postsModel_1.Post.findByIdAndUpdate(postId, {
        $set: {
            content,
            image,
            likes,
        },
    }, { new: true });
    (0, successHandler_1.successHandler)(res, '貼文編輯成功', updatedPost);
});
exports.delPost = (0, handleErrorAsync_1.handleErrorAsync)(async (req, res, next) => {
    const postId = req.params.id;
    const userId = req.user.id;
    const currentPost = await postsModel_1.Post.findById(postId).populate({
        path: 'user',
        select: 'name photo',
    });
    if (!currentPost) {
        return (0, appError_1.appError)(400, '查無此貼文', next);
    }
    const deletedPost = await postsModel_1.Post.findByIdAndDelete(postId);
    (0, successHandler_1.successHandler)(res, '貼文刪除', deletedPost);
});
//# sourceMappingURL=postsControllers.js.map