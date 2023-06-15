import { Router } from 'express';
import controller from '../controller/products.controller.js';

const router = Router();

router.get('/', async (req, res) => {
  controller.getProducts(req, res);
});

router.get('/:pid', async (req, res, next) => {
  controller.getProductById(req, res, next);
});

router.post('/', async (req, res, next) => {
  controller.saveProduct(req, res, next);
});

router.put('/:pid', async (req, res, next) => {
  controller.updateProduct(req, res, next);
});

router.delete('/:pid', async (req, res, next) => {
  controller.deleteProduct(req, res, next);
});

export default router;