import express from 'express';
import multer from 'multer';
import path from 'path';
import { 
    searchEquipment, 
    searchPatientInfoAndTest, 
    getPatientPendingTests, 
    uploadTestResults 
} from '../controllers/pathologist.controller.js';

const router = express.Router();

// Multer setup for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/test-results/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'test-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedFileTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
        const ext = path.extname(file.originalname).toLowerCase();
        
        if (allowedFileTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Unsupported file format. Please upload PDF, DOC, DOCX, JPG, JPEG, or PNG.'));
        }
    }
});

router.get('/searchBy', searchEquipment);
router.get('/searchById', searchPatientInfoAndTest);

router.get('/pendingTests', getPatientPendingTests); 
router.post('/uploadTestResults', upload.single('testResultFile'), uploadTestResults);

export default router;
