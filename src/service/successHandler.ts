import { Response } from 'express';

export const successHandler = (
  res: Response,
  message: string,
  data: any,
  statusCode = 200
): void => {
  res.status(statusCode).json({
    status: 'success',
    message: message,
    data: data,
  });
};


