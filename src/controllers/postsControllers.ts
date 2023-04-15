import { RequestHandler } from 'express';
import { Post } from '../models/postsModel';
import { appError } from '../service/appError';
import { handleErrorAsync } from '../service/handleErrorAsync';
import { successHandler } from '../service/successHandler';

export const getPosts: RequestHandler = handleErrorAsync(
  async (req, res, next) => {
    const { keyword, sortby } = req.query;
    const search =
      keyword !== undefined ? { content: new RegExp(`${keyword}`) } : {};
    const sort = sortby === 'asc' ? 'createdAt' : '-createdAt';
    const posts = await Post.find(search)
      .populate({
        path: 'user',
        select: 'name photo',
      })
      .sort(sort);
    successHandler(res, '取得貼文', posts);
  }
);

export const createPost: RequestHandler = handleErrorAsync(
  async (req, res, next) => {
    const { content, image } = req.body;
    if (content === undefined) {
      return appError(400, 'content 必填', next);
    }
    const newPost = await Post.create({
      user: req.user.id,
      content,
      image,
    });
    successHandler(res, '貼文新增成功', newPost);
  }
);

export const editPost: RequestHandler = handleErrorAsync(
  async (req, res, next) => {
    const { content, image, likes } = req.body;
    const postId = req.params.id;
    const currentPost = await Post.findById(postId).populate({
      path: 'user',
      select: 'name photo',
    });
    if (!currentPost) {
      return appError(400, '查無此貼文', next);
    }
    if (content === undefined) {
      return appError(400, 'content 必填', next);
    }
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $set: {
          content,
          image,
          likes,
        },
      },
      { new: true }
    );
    successHandler(res, '貼文編輯成功', updatedPost);
  }
);

export const delPost: RequestHandler = handleErrorAsync(
  async (req, res, next) => {
    const postId = req.params.id;
    const userId = req.user.id;
    const currentPost = await Post.findById(postId).populate({
      path: 'user',
      select: 'name photo',
    });
    if (!currentPost) {
      return appError(400, '查無此貼文', next);
    }
    const deletedPost = await Post.findByIdAndDelete(postId);
    successHandler(res, '貼文刪除', deletedPost);
  }
);
