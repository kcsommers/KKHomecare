import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { AdminModel } from '../database/models/admin.model';
import { Admin } from '@kk/core';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { checkAuth } from '../middleware/check-auth';
import { Request, Response, Router, NextFunction } from 'express';

const router = Router();

dotenv.config();

router.get('', checkAuth, (req: Request, res: Response) => {
  console.log('Hit admin route')
});

router.post('/signup', (req: Request, res, next) => {
  const { email, username, password } = req.body;
  AdminModel.find({ email })
    .exec()
    .then(user => {
      if (user.length) {
        return res.status(409).json({
          success: false,
          error: 'Email already exists'
        })
      } else {
        bcrypt.genSalt(10, (err: Error, salt: string) => {
          bcrypt.hash(password, salt, (hashError: Error, hash: string) => {
            if (hashError) {
              return res.status(500).json({
                success: false,
                error: hashError
              });
            } else {
              const admin = new AdminModel({
                _id: new mongoose.Types.ObjectId(),
                email,
                username,
                password: hash
              });
              admin
                .save()
                .then(result => {
                  console.log(result);
                  res.status(201).json({
                    success: true,
                    error: null
                  });
                })
                .catch((saveErr: Error) => {
                  console.error(saveErr);
                  res.status(500).json({
                    success: false,
                    error: saveErr
                  });
                })
            }
          });
        });
      }
    })
});

router.post('/login', (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;
  AdminModel.find({ username })
    .exec()
    .then((adminArr: Admin[]) => {
      if (!adminArr.length) {
        return res.status(401).json({
          success: false,
          error: new Error('Auth failed')
        })
      }
      bcrypt.compare(password, adminArr[0].password, (compareError, successful) => {
        if (compareError) {
          return res.status(401).json({
            success: false,
            error: new Error('Auth failed')
          })
        }
        if (successful) {
          const token = jwt.sign(
            {
              email: adminArr[0].email,
              userId: adminArr[0]._id
            },
            process.env.JWT_KEY,
            {
              expiresIn: '1h'
            }
          );
          return res.status(200).json({
            success: true,
            error: null,
            data: {
              admin: {
                email: adminArr[0].email,
                username: adminArr[0].username,
                token,
                expiresAt: Date.now() + (60 * 60 * 1000)
              }
            }
          })
        } else {
          return res.status(401).json({
            success: false,
            error: new Error('Auth failed')
          })
        }
      })
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        success: false,
        error: err
      })
    })
});

router.delete('/', checkAuth, (req: Request, res: Response) => {
  const { username } = req.body;
  AdminModel.deleteOne({ username }, (err) => {
    if (err) {
      return res.status(500).json({
        success: null,
        error: err
      });
    }
    res.status(200).json({
      success: true,
      error: null
    })
  });
});

module.exports = router;