import { productsModel } from "../dao/models/products.model.js";
import CartsManager from "../dao/dbManagers/carts.js";
import UsersManager from "../dao/dbManagers/users.js";
import config from "../config/config.js";
import jwt from "jsonwebtoken";

const insCarts = new CartsManager();
const insUsers = new UsersManager();

const getChat = async (req, res) => {
  if (req.user.role === "admin")
    return res.send("Solo los usuarios pueden ingresar al chat");
  res.render("chat", {
    username: req.user.name,
    role: req.user.role,
  });
};

const getProducts = async (req, res) => {
  try {
    const user = {
      id: req.user.id,
      name: req.user.name.split(" ")[0],
      email: req.user.email,
      role: req.user.role,
    };

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
    const { docs, hasPrevPage, hasNextPage, nextPage, prevPage } =
      await productsModel.paginate(query, {
        page,
        limit,
        sort: { price: sort },
        lean: true,
      });
    const products = docs;
    query = JSON.stringify(query);

    res.render("products", {
      products,
      hasPrevPage,
      hasNextPage,
      nextPage,
      prevPage,
      limit,
      query,
      sort,
      user: user,
    });
  } catch (err) {
    throw new Error(err);
  }
};

const getCart = async (req, res) => {
  try {
    const { cid } = req.params;

    const user = {
      id: req.user.id,
      name: req.user.name.split(" ")[0],
      email: req.user.email,
      role: req.user.role,
    };

    const cart = await insCarts.getCartById(cid);

    let products = [];

    cart.products.forEach((el) => {
      const obj = {
        title: el.pid.title,
        description: el.pid.description,
        code: el.pid.code,
        price: el.pid.price,
        quantity: el.quantity,
      };
      products.push(obj);
    });

    res.render("carts", { products, user });
  } catch (err) {
    throw new Error(err);
  }
};

const getLogin = async (req, res) => {
  res.render("login");
};

const getRegister = async (req, res) => {
  res.render("register");
};

const getUsers = async (req, res) => {
  try {
    if (req.user.role != "admin")
      return res
        .status(401)
        .json({ status: "No tienes los permisos para este sitio" });

    const usersDB = await insUsers.getAll();
    let users = [];

    usersDB.forEach((user) => {
      if (user.last_name == "not last name") {
        const obj = {
          id: user._id,
          first_name: user.first_name,
          age: user.age,
          role: user.role,
        };

        users.push(obj);
      } else {
        const obj = {
          id: user._id,
          first_name: user.first_name,
          last_name: user.last_name,
          age: user.age,
          role: user.role,
        };

        users.push(obj);
      }
    });

    res.render("users", { users });
  } catch (err) {
    throw new Error(err);
  }
};

const getRestore = async (req, res) => {
  res.render("restore");
};

const getChangePassword = async (req, res) => {
  const token = req.params.token;
  let expired;

  jwt.verify(token, config.tokenRestore, function (err, user) {
    if (err) {
      expired = true;
    } else {
      expired = false;
    }
  });

  res.render("changePassword", { token, expired });
};

const uploadFIle = (req, res) => {
  res.render("upload");
};

export default {
  getChat,
  getProducts,
  getCart,
  getRegister,
  getLogin,
  getUsers,
  getRestore,
  getChangePassword,
  uploadFIle,
};
