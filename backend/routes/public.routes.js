import express from 'express';
import DataController from "../controllers/publicDataController.js";
const router = express.Router();

// Fix the route handler to use DataController
router.get('/', DataController.downloadZip);

export default router;
