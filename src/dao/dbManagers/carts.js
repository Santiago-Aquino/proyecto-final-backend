import { cartsModel } from '../models/carts.model.js';

export default class CartsManager {
  constructor() {
    //console.log('Manejo de carritos')
  }

  getAll = async () => {
    try {
      const carts = await cartsModel.find();
      return carts;
    }
    catch (err) {
      throw new Error(err);
    }
  };

  getCartById = async (id) => {
    try {
      const cart = await cartsModel.findOne({ _id: id });
      return cart;
    }
    catch (err) {
      throw new Error(err);
    }
  };

  saveCart = async () => {
    try {
      const newCart = await cartsModel.create({ products: [] });
      return newCart;
    }
    catch (err) {
      throw new Error(err);
    }
  };

  updateCart = async (id, obj) => {
    try {
      const result = await cartsModel.updateOne({ _id: id }, { $set: obj });
      return result;
    }
    catch (err) {
      throw new Error(err);
    }
  };

  deleteAllProducts = async (cid) => {
    try {
      const cart = await this.getCartById(cid);
      if (!cart) return false;
      await this.updateCart(cid, { products: [] });
      return cart;
    }
    catch (err) {
      throw new Error(err);
    }
  };

  saveProduct = async (cid, pid) => {
    try {
      const cart = await this.getCartById(cid);
      const products = cart.products;
      const product = products.find(el => el.pid._id == pid);
      const index = products.findIndex(el => el.pid._id == pid);
      if (product === undefined) {
        products.push({ pid: pid, quantity: 1 });
        await this.updateCart(cid, { products: products });
        return { payload: { pid: pid, quantity: 1 } }
      }
      else {
        products[index].quantity++;
        await this.updateCart(cid, { products: products });
        return { payload: product };
      }
    }
    catch (err) {
      throw new Error(err);
    }
  };

  deleteProduct = async (cid, pid) => {
    try {
      const cart = await this.getCartById(cid);
      const products = cart.products;
      const index = products.findIndex(el => el.pid._id == pid);
      if (index == -1) return { status: 'error', error: `The product with id: ${pid} no exists` };
      else {
        products.splice(index, 1);
        await this.updateCart(cid, { products: products });
        return { status: `success!`, message: `The product with id: ${pid} was deleted` };
      }
    }
    catch (err) {
      throw new Error(err);
    }
  };

  updateProduct = async (cid, pid, obj) => {
    try {
      const cart = await this.getCartById(cid);
      if (!cart) return false;
      const products = cart.products;
      const index = products.findIndex(el => el.pid._id == pid);
      if (index == -1) return false;
      else {
        products[index].quantity = obj.quantity;
        await this.updateCart(cid, { products: products });
        return { status: `success!`, message: `The product with id: ${pid} updated` };
      }
    }
    catch (err) {
      throw new Error(err)
    }
  };
}