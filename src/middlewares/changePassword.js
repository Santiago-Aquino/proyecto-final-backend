import jwt from "jsonwebtoken";
import config from "../config/config.js";
import UsersManager from "../dao/dbManagers/users.js";
import { isValidPassword } from "../utils.js";

const insUser = new UsersManager();

export const changePassword = async (req, res, next) => {
  let token = req.body.token.trim();
  let password = req.body.password;

  if (!password)
    return res.json({
      status: "error",
      error: "La contraseña no puede estar vacia",
    });

  let result;

  jwt.verify(token, config.tokenRestore, function (error, user) {
    req.logger.debug("El token es");
    req.logger.debug(token);
    if (error) {
      if (error) {
        return res.json({
          status: "Error",
          error: "Su token no es valido o expiro",
        });
      }
    } else {
      result = user;
    }
  });

  let email = result.email;

  let account = await insUser.getOne(null, email);

  if (!account)
    return res.json({ status: "error", error: "La cuenta ya no existe" });

  if (isValidPassword(account, password))
    return res.json({ status: "error", error: "La contraseña es la misma" });

  req.account = account;
  req.password = password;

  next();
};
