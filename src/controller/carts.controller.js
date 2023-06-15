import CartsManager from "../dao/dbManagers/carts.js";
import TicketsManager from "../dao/dbManagers/tickets.js";
import ProductsManager from "../dao/dbManagers/products.js";
import __dirname from "../utils.js";
import CustomError from "../customError/customError.js";
import enumErrors from "../customError/enum.js";
import { transport } from "../utils.js";

const insCart = new CartsManager();
const insTicket = new TicketsManager();
const insProduct = new ProductsManager();

const getCarts = async (req, res, next) => {
  try {
    const carts = await insCart.getAll();

    if (carts.length === 0) {
      req.logger.error("No se encontraron carritos");
      CustomError.createError({
        name: "Error, no se encontraron carritos",
        cause: "No hay carritos en la base de datos",
        message: "no se encontraron carritos",
        code: enumErrors.DATABASE_ERROR,
      });
    }

    res.json({ status: "success!", payload: carts });
  } catch (err) {
    next(err);
  }
};

const getCartById = async (req, res, next) => {
  try {
    const cid = req.params.cid;

    let result = await insCart.getCartById(cid);

    if (!result) {
      req.logger.warning(`no se encontro el carrito con el id ${cid}`);
      CustomError.createError({
        name: "Error, no se encontro el carrito",
        cause: "No existe ese carrito en la base de datos",
        message: `no se encontro el carrito con el id ${cid}`,
        code: enumErrors.INVALID_TYPES_ERROR,
      });
    }

    res.json({ status: "success!", payload: result });
  } catch (err) {
    next(err);
  }
};

const saveCart = async (req, res, next) => {
  try {
    const saveCart = await insCart.saveCart();

    if (!saveCart) {
      req.logger.error("Fallo en la base de datos en la creacion");
      CustomError.createError({
        name: "Error en la creacion del carrito",
        message: "Error en la creacion del carrito",
        cause: "Fallo en la base de datos en la creacion",
        code: enumErrors.DATABASE_ERROR,
      });
    }

    res.json({ status: "success!", payload: saveCart });
  } catch (err) {
    next(err);
  }
};

const saveProduct = async (req, res, next) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;

    const result = await insCart.saveProduct(cid, pid);

    if (!result) {
      req.logger.error(`no se encontro el carrito con el id ${cid}`);
      CustomError.createError({
        name: "Error, no se encontro el carrito",
        cause: "No existe ese carrito en la base de datos",
        message: `no se encontro el carrito con el id ${cid}`,
        code: enumErrors.DATABASE_ERROR,
      });
    }

    res.json({ status: "success!", payload: result });
  } catch (err) {
    next(err);
  }
};

const deleteAllProducts = async (req, res, next) => {
  try {
    const { cid } = req.params;
    const cart = await insCart.deleteAllProducts(cid);

    if (!cart) {
      req.logger.error(`no se encontro el carrito con el id ${cid}`);
      CustomError.createError({
        name: "Error, no se encontro el carrito",
        cause: "No existe ese carrito en la base de datos",
        message: `no se encontro el carrito con el id ${cid}`,
        code: enumErrors.DATABASE_ERROR,
      });
    }

    res.json({ status: "success!", payload: cart });
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const result = await insCart.deleteProduct(cid, pid);

    if (!result) {
      req.logger.error(`no se encontro el carrito con el id ${cid}`);
      CustomError.createError({
        name: "Error, no se encontro el carrito",
        cause: "No existe ese carrito en la base de datos",
        message: `no se encontro el carrito con el id ${cid}`,
        code: enumErrors.DATABASE_ERROR,
      });
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
};

const updateCart = async (req, res, next) => {
  try {
    const { cid } = req.params;
    const body = req.body;

    if (!cid || !pid || !body) {
      req.logger.warning("no se ingresaron todos los datos");
      CustomError.createError({
        name: "Error, no se ingresaron todos los datos",
        cause: "no se ingresaron los datos necesarios",
        message: "Ingrese todos los datos",
        code: enumErrors.INVALID_TYPES_ERROR,
      });
    }

    const newProducts = body.products;

    if (newProducts.length === 0) {
      req.logger.warning("no se ingresaron productos");
      CustomError.createError({
        name: "Error, no se ingresaron productos",
        cause: "no se ingresaron productos",
        message: "Ingrese algun producto",
        code: enumErrors.INVALID_TYPES_ERROR,
      });
    }
    const result = await insCart.updateCart(cid, { products: newProducts });

    if (!result) {
      req.logger.warning("no se ingresaron productos");
      CustomError.createError({
        name: "Error, no se ingresaron productos",
        cause: "no se ingresaron productos",
        message: "Ingrese algun producto",
        code: enumErrors.INVALID_TYPES_ERROR,
      });
    }

    res.json({ status: "success!", payload: result });
  } catch (err) {
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const body = req.body;

    if (!body.quantity) {
      req.logger.warning("no se ingresaron todos los datos");
      CustomError.createError({
        name: "Error, no se ingresaron todos los datos",
        cause: "no se ingresaron los datos necesarios",
        message: "Ingrese todos los datos",
        code: enumErrors.INVALID_TYPES_ERROR,
      });
    }

    const result = await insCart.updateProduct(cid, pid, body);

    if (!result) {
      req.logger.warning("no se ingresaron los datos correctamente");
      CustomError.createError({
        name: "Error, no se ingresaron los datos correctamente",
        cause: "no se ingresaron los datos o estan erroneos",
        message: "Ingrese un carrito o un producto correcto",
        code: enumErrors.INVALID_TYPES_ERROR,
      });
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
};

const buyCart = async (req, res, next) => {
  try {
    const { cid } = req.params;
    const cart = await insCart.getCartById(cid);

    if (cart.products.length === 0) {
      req.logger.error("no hay productos en el carrito");
      CustomError.createError({
        name: "Error, no hay productos en el carrito",
        cause: "No se guardaron productos en el carrito",
        message: "no hay productos en el carrito",
        code: enumErrors.DATABASE_ERROR,
      });
    }

    const totalPrice = [];
    const productsNoComplete = [];

    for (let product of cart.products) {
      if (product.pid.stock >= product.quantity) {
        let newStock = product.pid.stock - product.quantity;

        totalPrice.push(product.pid.price * product.quantity);

        await insProduct.updateProduct(product.pid._id, { stock: newStock });
      } else {
        totalPrice.push(0);
        productsNoComplete.push(product);
      }
    }

    await insCart.updateCart(cid, { products: productsNoComplete });

    const user = cart.users[0];

    if (!user) {
      req.logger.error("No se encuentra un usuario asociado al carrito");
      CustomError.createError({
        name: "Error, no hay un usuario asociado al carrito",
        cause: "No se guardo un usuario en el carrito",
        message: "error en el sistema, no se guardo el usuario en el carrito",
        code: enumErrors.DATABASE_ERROR,
      });
    }

    let newTicket;

    if (productsNoComplete.length === 0) {
      let obj = {
        code: Date.now().toString(32).toUpperCase(),
        purchase_datetime: `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`,
        amount: totalPrice.reduce((prev, current) => prev + current),
        purchaser: user.email,
      };
      newTicket = obj;
    } else {
      let obj = {
        code: Date.now().toString(32).toUpperCase(),
        purchase_datetime: `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`,
        amount: totalPrice.reduce((prev, current) => prev + current),
        purchaser: user.email,
        productsNoComplete: productsNoComplete || 0,
      };

      newTicket = obj;
    }

    await insTicket.createTicket(newTicket);

    await transport.sendMail({
      from: "santiaaquino4@gmail.com",
      to: user.email,
      subject: "Informacion de su compra de productos",
      html: `<img src="cid:img"/>
          <h1>Su ticket de compra: </h1>
          code :${newTicket.code} <br>
          purchase_datetime: ${newTicket.purchase_datetime} <br>
          amount: ${newTicket.amount} <br>
          purchaser: ${newTicket.purchaser} <br>
          productsNoComplete: ${newTicket.productsNoComplete}`,
      attachments: [
        {
          filename: "compra.webp",
          path: __dirname + "/assets/img/compra.webp",
          cid: "img",
        },
      ],
    });

    res.json({
      status: "Success!",
      message: `Se le envio un mail con la siguiente informacion`,
      payload: newTicket,
    });
  } catch (err) {
    next(err);
  }
};

export default {
  getCarts,
  getCartById,
  saveCart,
  deleteAllProducts,
  deleteProduct,
  saveProduct,
  updateCart,
  updateProduct,
  buyCart,
};
