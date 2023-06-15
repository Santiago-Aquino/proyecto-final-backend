import { Router } from "express";
import controller from '../controller/carts.controller.js';


const router = Router();

router.get('/', async (req, res, next) => {
  controller.getCarts(req, res, next);
});

router.get('/:cid', async (req, res, next) => {
  controller.getCartById(req, res, next);
});

router.post('/', async (req, res) => {
  controller.saveCart(req,res);
});

router.post('/:cid/products/:pid', async (req, res, next) => {
  controller.saveProduct(req, res, next);
});

router.delete('/:cid', async (req, res, next) => {
  controller.deleteAllProducts(req, res, next);
});

router.delete('/:cid/products/:pid', async (req, res, next) => {
  controller.deleteProduct(req, res, next);
});

router.put('/:cid', async (req, res, next) => {
  controller.updateCart(req, res, next);
});

router.put('/:cid/products/:pid', async (req, res, next) => {
  controller.updateProduct(req, res, next);
});

router.post('/:cid/purchase', async (req, res, next) => {
  controller.buyCart(req, res, next);
});

export default router;
