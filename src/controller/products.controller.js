import productManager from "../dao/dbManagers/products.js";
import { productsModel } from "../dao/models/products.model.js";
import CustomError from "../customError/customError.js";
import { generateProductErrorInfo } from "../customError/info.js";
import enumErrors from "../customError/enum.js";

const ins = new productManager();

const getProducts = async (req, res) => {
  try {
    let query;
    const page = req.query.page || 1;
    const limit = req.query.limit || 4;
    const reqQuery = req.query.query;

    if (reqQuery === undefined) {
      query = {};
    } else {
      query = JSON.parse(reqQuery);
    }

    const sort = req.query.sort || "";
    const { docs, hasPrevPage, hasNextPage, nextPage, prevPage, totalPages } =
      await productsModel.paginate(query, {
        page,
        limit,
        sort: { price: sort },
        lean: true,
      });
    const products = docs;

    if (products.length === 0)
      return res.json({
        status: "Erorr",
        error: "no hay productos disponibles",
      });

    query = JSON.stringify(query);

    let prevLink = "";
    let nextLink = "";

    if (hasPrevPage)
      prevLink = `/products?query=${query}&page=${
        page - 1
      }&limit=${limit}&sort=${sort}`;
    if (hasNextPage)
      nextLink = `/products?query=${query}&page=${
        page + 1
      }&limit=${limit}&sort=${sort}`;

    res.json({
      status: "success!",
      payload: products,
      totalPages,
      prevPage,
      nextPage,
      page,
      hasPrevPage,
      hasNextPage,
      prevLink,
      nextLink,
    });
  } catch (err) {
    throw new Error(err);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const id = req.params.pid;
    const product = await ins.getProductById(id);

    if (!product) {
      req.logger.warning("ingreso de producto no correspondiente");
      CustomError.createError({
        name: "Error al encontrar el producto",
        message: "Ingrese un producto que exista",
        cause: "ingreso de producto no correspondiente",
        code: enumErrors.INVALID_TYPES_ERROR,
      });
    }

    res.json({ status: "success!", payload: product });
  } catch (err) {
    next(err);
  }
};

const saveProduct = async (req, res, next) => {
  try {
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail,
    } = req.body;

    if (
      !title ||
      !description ||
      !code ||
      !price ||
      !status ||
      !stock ||
      !category ||
      !thumbnail
    ) {
      req.logger.warning(
        generateProductErrorInfo({
          title,
          description,
          code,
          price,
          status,
          stock,
          category,
          thumbnail,
        })
      );
      CustomError.createError({
        name: "Error al guardar el producto",
        message: "Ingrese todos los campos",
        cause: generateProductErrorInfo({
          title,
          description,
          code,
          price,
          status,
          stock,
          category,
          thumbnail,
        }),
        code: enumErrors.INVALID_TYPES_ERROR,
      });
    }

    const newProduct = {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail,
    };

    const saveProduct = await ins.saveProduct(newProduct);

    res.json({ status: "success!", payload: saveProduct });
  } catch (err) {
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail,
    } = req.body;
    const id = req.params.pid;

    if (
      !title &&
      !description &&
      !code &&
      !price &&
      !status &&
      !stock &&
      !category &&
      !thumbnail
    ) {
      req.logger.warning(
        generateProductErrorInfo({
          title,
          description,
          code,
          price,
          status,
          stock,
          category,
          thumbnail,
        })
      );
      CustomError.createError({
        name: "Error al guardar el producto",
        message: "Ingrese algun campo para actualizar",
        cause: generateProductErrorInfo({
          title,
          description,
          code,
          price,
          status,
          stock,
          category,
          thumbnail,
        }),
        code: enumErrors.INVALID_TYPES_ERROR,
      });
    }

    const newProduct = await ins.updateProduct(id, {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail,
    });

    if (!newProduct) {
      req.logger.warning("ingreso de producto no correspondiente");
      CustomError.createError({
        name: "Error el id del producto es erroneo",
        message: "Ingrese un producto que exista",
        cause: "ingreso de producto no correspondiente",
        code: enumErrors.INVALID_TYPES_ERROR,
      });
    }

    res.json({ status: "success!", payload: newProduct });
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const id = req.params.pid;
    const product = await ins.deleteProduct(id);

    if (!product) {
      req.logger.warning("ingreso de producto no correspondiente");
      CustomError.createError({
        name: "Error el id del producto es erroneo",
        message: "Ingrese un producto que exista",
        cause: "ingreso de producto no correspondiente",
        code: enumErrors.INVALID_TYPES_ERROR,
      });
    }

    res.json({ status: "success!", payload: product });
  } catch (err) {
    next(err);
  }
};

export default {
  getProducts,
  getProductById,
  saveProduct,
  updateProduct,
  deleteProduct,
};
