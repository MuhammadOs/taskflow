import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { User } from '../models/User';

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.userId).select('-password');

      if (!user) {
        res.status(401).json({
          status: 'fail',
          message: 'User belonging to this token no longer exists',
        });
        return;
      }

      req.user = user;
      next();
    } catch {
      res.status(401).json({
        status: 'fail',
        message: 'Not authorized, invalid or expired token',
      });
    }
  } else {
    res.status(401).json({
      status: 'fail',
      message: 'Not authorized, no token provided',
    });
  }
};
