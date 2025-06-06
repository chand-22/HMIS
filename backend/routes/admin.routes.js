import express from 'express';
import { generatePayslip, searchEmployees, updateInventory, addStaff, updateSalary , processPayroll, updateOrderStatus } from '../controllers/adminController.js';
import  upload  from '../middleware/multer.js';
import bodyParser from 'body-parser';

const router = express.Router();

router.post('/generate-payslip', generatePayslip);
router.get('/search-employees', searchEmployees);
router.post('/update-inventory', updateInventory);
router.post('/add-staff', upload.single('profile_pic'), addStaff);
router.post('/update-salary', updateSalary);
router.post('/process-payroll', processPayroll)
router.post('/update-order-status', updateOrderStatus); // for both equipment and medicine order status
export default router;
