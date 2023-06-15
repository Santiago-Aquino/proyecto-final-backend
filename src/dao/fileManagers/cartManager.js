import fs from 'fs';
import { resolve } from 'path';
import { inspect } from 'util';

export default class CartsManager {
  constructor(path) {
    this.id = 0;
    this.path = path;
    this.carts = [];
  };

  addCart = async () => {
    try {
      this.id++;
      const obj = {
        'id': this.id,
        'products': []
      };
      this.carts.push(obj);
      await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, '\t'));
    }
    catch (err) {
      throw new Error(err);
    }
  };

  getCarts = async () => {
    try {
      const contentString = await fs.promises.readFile(this.path, 'utf-8');
      const contentParse = await JSON.parse(contentString);
      return contentParse;
    }
    catch (err) {
      throw new Error(err);
    }
  }

  getCartById = async (id) => {
    try {
      const contentString = await fs.promises.readFile(this.path, 'utf-8');
      const contentParse = await JSON.parse(contentString);
      const found = contentParse.find(el => el.id == id);
      return found;
    }
    catch (err) {
      throw new Error(err);
    }
  };

  addProduct = async (cid, pid) => {
    try {
      const contentParse = await this.getCarts();
      const cart = contentParse.find(el => el.id == cid);
      const products = cart.products;
      const product = products.find(el => el.id == pid);
      if (product === undefined) {
        const obj = {
          'id': pid,
          'quantity': 1
        };
        products.push(obj);
      }
      else {
        product.quantity++;
      }
      this.carts[cid - 1].products = products;
      await fs.promises.writeFile(this.path, JSON.stringify(contentParse, null, '\t'));
    }
    catch (err) {
      throw new Error(err);
    }
  }
};