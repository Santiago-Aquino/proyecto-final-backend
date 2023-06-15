import { productsModel } from "../models/products.model.js";

export default class ProductManager {
  constructor() {
    //console.log('Nueva clase para el manejo de productos');
  }

  getAll = async () => {
    try {
      const products = await productsModel.find();
      return products;
    } catch (err) {
      throw new Error(err);
    }
  };

  getProductById = async (id) => {
    try {
      const product = await productsModel.findOne({ _id: id });
      return product;
    } catch (err) {
      throw new Error(err);
    }
  };

  saveProduct = async (product) => {
    try {
      const newProduct = await productsModel.create(product);
      return newProduct;
    } catch (err) {
      throw new Error(err);
    }
  };

  updateProduct = async (id, obj) => {
    try {
      const result = await productsModel.updateOne({ _id: id }, { $set: obj });
      if (result.acknowledged === false) return false;
      return result;
    } catch (err) {
      throw new Error(err);
    }
  };

  deleteProduct = async (id) => {
    try {
      const result = await productsModel.deleteOne({ _id: id });
      if (result.deletedCount === 0) return false;
      return result;
    } catch (err) {
      throw new Error(err);
    }
  };

  sortProducts = async (num) => {
    try {
      const result = await productsModel.find().sort({ price: num });
      return result;
    } catch (err) {
      throw new Error(err);
    }
  };
}
