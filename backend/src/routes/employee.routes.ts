import { Router } from 'express';
import multer from 'multer';
import {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  uploadPhoto,
} from '../controllers/employee.controller';

const router = Router();

// Configure multer for memory storage (since we upload to Supabase)
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', upload.single('photo'), uploadPhoto);

router.post('/', createEmployee);
router.get('/', getEmployees);
router.get('/:id', getEmployeeById);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

export default router;
