import { Router } from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from '../controllers/taskController';
import { createTaskValidation, updateTaskValidation } from '../validators/taskValidator';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Protect all task routes
router.use(protect);

router.route('/')
  .post(createTaskValidation, createTask)
  .get(getTasks);

router.route('/:id')
  .get(getTaskById)
  .put(updateTaskValidation, updateTask)
  .delete(deleteTask);

export default router;
