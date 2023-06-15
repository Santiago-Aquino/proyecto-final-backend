// ruta para traer los productos falsos creados en faker
import { Router } from 'express';
import controller from '../controller/mocking.controller.js';

const router = Router();

router.get('/mockingproducts', async (req, res, next) => {
  controller.generateProductsFaker(req, res, next);
});

export default router;