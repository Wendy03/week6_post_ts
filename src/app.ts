import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import logger from 'morgan';
import path from 'path';
import resError from './service/resError';
import { AppError } from './types';


import postsRouter from './routes/posts';
import usersRouter from './routes/users';

const app = express();
require('./connections');
require('./service/process');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);
app.use('/posts', postsRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    status: 'error',
    message: '無此路由資訊',
  });
});

app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  // dev
  err.statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV === 'dev') {
    resError.resErrorDev(err, res);
  }
  // production
  if (err.name === 'ValidationError') {
    err.message = '資料欄位未填寫正確，請重新輸入！';
    err.isOperational = true;
    resError.resErrorProd(err, res);
  }
  resError.resErrorProd(err, res);
});

export default app;
