import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Task, TaskStatus, TaskPriority } from '../models/Task';

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ status: 'fail', errors: errors.array() });
    return;
  }

  try {
    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      user: req.user!._id,
    });

    res.status(201).json({
      status: 'success',
      data: { task },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: (error as Error).message,
    });
  }
};

// @desc    Get all tasks for logged in user (with search & filter)
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, status, priority, sortBy = 'createdAt', order = 'desc' } = req.query;

    // Build query filter scoped to logged in user
    const queryFilter: Record<string, unknown> = { user: req.user!._id };

    if (status) {
      queryFilter.status = status as TaskStatus;
    }

    if (priority) {
      queryFilter.priority = priority as TaskPriority;
    }

    if (search) {
      queryFilter.$or = [
        { title: { $regex: search as string, $options: 'i' } },
        { description: { $regex: search as string, $options: 'i' } },
      ];
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    const tasks = await Task.find(queryFilter).sort({ [sortBy as string]: sortOrder });

    res.status(200).json({
      status: 'success',
      results: tasks.length,
      data: { tasks },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: (error as Error).message,
    });
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
export const getTaskById = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user!._id,
    });

    if (!task) {
      res.status(404).json({
        status: 'fail',
        message: 'Task not found or unauthorized access',
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: { task },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: (error as Error).message,
    });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ status: 'fail', errors: errors.array() });
    return;
  }

  try {
    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user!._id },
      { title, description, status, priority, dueDate },
      { new: true, runValidators: true }
    );

    if (!task) {
      res.status(404).json({
        status: 'fail',
        message: 'Task not found or unauthorized access',
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: { task },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: (error as Error).message,
    });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user!._id,
    });

    if (!task) {
      res.status(404).json({
        status: 'fail',
        message: 'Task not found or unauthorized access',
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      message: 'Task deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: (error as Error).message,
    });
  }
};
