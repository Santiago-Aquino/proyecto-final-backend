import jwt from "jsonwebtoken";
import UsersManager from "../dao/dbManagers/users.js";
import { isValidPassword, createHash } from "../utils.js";
import config from "../config/config.js";
import UsersDTO from "../dao/DTOs/users.dto.js";
import { transport } from "../utils.js";

const insUsers = new UsersManager();

//register

const register = async (req, res) => {
  try {
    if (
      req.user.email == config.admin &&
      isValidPassword(req.user, config.adminPass)
    ) {
      await insUsers.updateUser(req.user.email, { role: "admin" });
    }

    res.json({
      status: "success!",
      message: "Usuario registrado",
      payload: req.user,
    });
  } catch (err) {
    throw new Error(err);
  }
};

const failregister = async (req, res) => {
  res.json({ status: "error", error: "Failed" });
};

// login

const login = async (req, res) => {
  try {
    const serializeUser = {
      id: req.user._id,
      name: `${req.user.first_name} ${req.user.last_name}`,
      role: req.user.role,
      email: req.user.email,
      cart: req.user.cart,
    };

    let token = jwt.sign(serializeUser, config.token, { expiresIn: "24h" });

    res
      .cookie(config.cookie, token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
      })
      .json({ status: "success!", payload: serializeUser });
  } catch (err) {
    throw new Error(err);
  }
};

const faillogin = async (req, res) => {
  res.json({ status: "Error!", error: "Failed" });
};

// github

const github = async (req, res) => {
  try {
    const serializeUser = {
      id: req.user._id,
      name: `${req.user.first_name} ${req.user.last_name}`,
      role: req.user.role,
      email: req.user.email,
    };

    let token = jwt.sign(serializeUser, config.token, { expiresIn: "24h" });

    res
      .cookie(config.cookie, token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
      })
      .redirect("/products");
  } catch (err) {
    throw new Error(err);
  }
};

// restore

const restore = async (req, res, next) => {
  try {
    const email = req.user.email;

    const user = { email: email };

    let token = jwt.sign(user, config.tokenRestore, { expiresIn: "1h" });

    await transport.sendMail({
      from: "santiaaquino4@gmail.com",
      to: `${email}`,
      subject: "Recuperacion de contraseña",
      html: `<a href="http://localhost:${config.port}/changePassword/${token}">Click aqui para reestablecer su contraseña</a>`,
    });

    res.json({ status: "Success", message: "Envio de email exitoso" });
  } catch (err) {
    next(err);
  }
};

//change password

const changePassword = async (req, res, next) => {
  try {
    let account = req.account;
    let password = req.password;

    let passwordHash = createHash(password);

    await insUsers.updateUser(account.email, { password: passwordHash });

    res.json({ status: "Success!", message: "cambio correctamente" });
  } catch (err) {
    next(err);
  }
};

//current

const current = async (req, res) => {
  const user = new UsersDTO(req.user);

  res.json(user);
};

export default {
  register,
  failregister,
  login,
  faillogin,
  github,
  restore,
  current,
  changePassword,
};
