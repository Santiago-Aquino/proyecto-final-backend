// ruta para traer los logs
import { Router } from 'express';
import controller from '../controller/logger.controller.js';

const router = Router();

router.get('/loggerTest', async (req, res, next) => {
  controller.generateLogs(req, res, next)
});

export default router;