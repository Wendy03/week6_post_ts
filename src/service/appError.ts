import { NextFunction } from 'express';
import { AppError } from '../types';

export const appError = (
  httpStatus: number,
  errMessage: string,
  next: NextFunction
): void => {
  const error: AppError = new Error(errMessage);
  error.statusCode = httpStatus;
  error.isOperational = true;
  next(error);
};
