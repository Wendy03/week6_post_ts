import bcrypt from 'bcryptjs';
import { RequestHandler } from 'express';
import validator from 'validator';
import { appError } from '../service/appError';
import { generateSendJWT } from '../service/auth';
import { handleErrorAsync } from '../service/handleErrorAsync';
import { successHandler } from '../service/successHandler';

import { User } from '../models/usersModel';

const passwordRule = /^([a-zA-Z]+\d+|\d+[a-zA-Z]+)[a-zA-Z0-9]*$/;

export const signup: RequestHandler = handleErrorAsync(
  async (req, res, next) => {
    let { name, email, password, photo } = req.body;
    const findUser = await User.findOne({ email });
    const errMsgAry: string[] = [];
    if (!name || !email || !password) {
      return appError(400, '欄位未填寫正確', next);
    }
    if (findUser) {
      return appError(400, '此 E-mail 已經註冊', next);
    }
    if (!validator.isLength(name, { min: 2 })) {
      errMsgAry.push('暱稱至少 2 個字元以上');
    }
    if (!validator.isLength(password, { min: 8 })) {
      errMsgAry.push('密碼需至少 8 碼以上');
    }
    if (!passwordRule.test(password)) {
      errMsgAry.push('密碼需英數混合的驗證');
    }
    if (!validator.isEmail(email)) {
      errMsgAry.push('Email 格式不正確');
    }
    if (errMsgAry.length > 0) {
      return appError(400, errMsgAry.join(''), next);
    }
    password = await bcrypt.hash(req.body.password, 12);
    const newUser = await User.create({
      email,
      password,
      name,
      photo,
    });
    generateSendJWT(newUser, 201, res);
  }
);
export const signin: RequestHandler = handleErrorAsync(
  async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return appError(400, '帳號密碼不可為空', next);
    }
    const user = await User.findOne({ email }).select('+password');
    const auth = await bcrypt.compare(password, user.password);
    if (!auth || !user) {
      return appError(400, '帳號或密碼錯誤，請重新輸入！', next);
    }
    generateSendJWT(user, 200, res);
  }
);
export const getUser: RequestHandler = handleErrorAsync(
  async (req, res, next) => {
    successHandler(res, '取得資料', req.user);
  }
);
export const editUser: RequestHandler = handleErrorAsync(
  async (req, res, next) => {
    const { name, gender, photo } = req.body;
    if (!name) {
      return appError(400, '欄位資料填寫不全', next);
    } else {
      const editUser = await User.findByIdAndUpdate(
        req.user.id,
        {
          name,
          gender,
          photo,
        },
        { new: true }
      );
      if (!editUser) {
        return appError(400, '編輯失敗', next);
      } else {
        const user = await User.findById(req.user.id);
        successHandler(res, '編輯成功', user);
      }
    }
  }
);
export const updatePassword: RequestHandler = handleErrorAsync(
  async (req, res, next) => {
    let { password, confirmPassword } = req.body;
    const errMsgAry = [];
    if (!validator.isLength(password, { min: 8 })) {
      errMsgAry.push('密碼需至少 8 碼以上');
    }
    if (password !== confirmPassword) {
      errMsgAry.push('密碼不一致！');
    }
    if (!passwordRule.test(password)) {
      errMsgAry.push('密碼需英數混合的驗證');
    }
    if (errMsgAry.length > 0) {
      return appError(400, errMsgAry.join(''), next);
    }
    password = await bcrypt.hash(password, 12);
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        password,
      },
      { new: true }
    );
    successHandler(res, '密碼更新成功', user);
  }
);
