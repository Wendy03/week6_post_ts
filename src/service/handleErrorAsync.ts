import { NextFunction, Request, Response } from 'express';
export const handleErrorAsync =
  (func:any) => (req: Request, res: Response, next: NextFunction) => {
    func(req, res, next).catch((error) => next(error));
  };


