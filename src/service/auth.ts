import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/usersModel';
import { appError } from '../service/appError';
import { handleErrorAsync } from '../service/handleErrorAsync';

interface Payload {
  id: string;
}

interface RequestWithUser extends Request {
  user?: any;
}

export const isAuth = handleErrorAsync(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    let token: string | undefined;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(appError(401, '你尚未登入！', next));
    }

    // 驗證 token 正確性
    const decoded = await new Promise<Payload>((resolve, reject) => {
      jwt.verify(token!, process.env.JWT_SECRET!, (err, payload) => {
        if (err) {
          reject(err);
        } else {
          resolve(payload as Payload);
        }
      });
    });
    const currentUser = await User.findById(decoded.id);
    req.user = currentUser;
    next();
  }
);

export const generateSendJWT = (user: any, statusCode: number, res: Response) => {
  // 產生 JWT token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_DAY!,
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



