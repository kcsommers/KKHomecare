import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { Admin } from '@kk/core';

interface AuthRequest extends Request {
  userData: string | object;
}

export const checkAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization;
    if (token) { // Bearer token
      const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_KEY);
      req.userData = decoded;
    } else {
      return res.status(401).json({
        success: false,
        error: 'Auth Failed'
      });
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Auth Failed'
    });
  }
  next();
};