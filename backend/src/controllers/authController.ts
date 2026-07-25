import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { User } from '../models/User';
import { generateToken } from '../utils/jwt';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      status: 'fail',
      errors: errors.array(),
    });
    return;
  }

  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        status: 'fail',
        message: 'User with this email already exists',
      });
      return;
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const token = generateToken(user._id.toString());

    res.status(201).json({
      status: 'success',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: (error as Error).message,
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      status: 'fail',
      errors: errors.array(),
    });
    return;
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({
        status: 'fail',
        message: 'Invalid email or password',
      });
      return;
    }

    const token = generateToken(user._id.toString());

    res.status(200).json({
      status: 'success',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: (error as Error).message,
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({
      status: 'fail',
      message: 'Not authorized',
    });
    return;
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        createdAt: req.user.createdAt,
      },
    },
  });
};
