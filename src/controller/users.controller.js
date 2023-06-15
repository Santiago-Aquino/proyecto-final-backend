import CartsManager from "../dao/dbManagers/carts.js";
import { userService } from "../repository/index.js";
import CustomError from "../customError/customError.js";
import enumErrors from "../customError/enum.js";
import { generateUserErrorInfo } from "../customError/info.js";
import { transport } from "../utils.js";

const insCart = new CartsManager();

const getAll = async (req, res, next) => {
  try {
    const users = await userService.getAll();

    if (!users) {
      req.logger.error("la base de datos no pudo traer los usuarios");
      CustomError.createError({
        name: "Error al encontrar los usuarios",
        message: "Error en la base de datos, no se pudo traer los usuarios",
        cause: "la base de datos no pudo traer los usuarios",
        code: enumErrors.DATABASE_ERROR,
      });
    }

    const userInfoNecessary = [];
    users.forEach((user) => {
      const obj = {
        first_name: user.first_name,
        last_name: user.last_name,
        password: user.password,
        email: user.email,
        cart: user.cart[0],
        role: user.role,
      };
      userInfoNecessary.push(obj);
    });

    res.json({ status: "success", payload: userInfoNecessary });
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { first_name, last_name, email, password, age } = req.body;

    if (!first_name || !last_name || !email || !password || !age) {
      req.logger.warning(
        generateUserErrorInfo({ first_name, last_name, email, password, age })
      );
      CustomError.createError({
        name: "Error al guardar el usuario",
        message: "Ingrese todos los campos",
        cause: generateUserErrorInfo({
          first_name,
          last_name,
          email,
          password,
          age,
        }),
        code: enumErrors.INVALID_TYPES_ERROR,
      });
    }

    let result = await userService.createUser({
      first_name,
      last_name,
      email,
      password,
      age,
    });

    if (!result) {
      req.logger.error("Fallo en la base de datos en la creacion");
      CustomError.createError({
        name: "Error en la creacion del usuario",
        message: "Error en la creacion del usuario",
        cause: "Fallo en la base de datos en la creacion",
        code: enumErrors.DATABASE_ERROR,
      });
    }

    res.json({ status: "success", payload: result });
  } catch (err) {
    next(err);
  }
};

const updates = async (req, res, next) => {
  try {
    const { uid, cid } = req.params;
    const cart = await insCart.getCartById(cid);

    if (!cart) {
      req.logger.warning(`no se encontro el carrito con el id ${cid}`);
      CustomError.createError({
        name: "Error, no se encontro el carrito",
        cause: "No existe ese carrito en la base de datos",
        message: `no se encontro el carrito con el id ${cid}`,
        code: enumErrors.INVALID_TYPES_ERROR,
      });
    }

    const user = await userService.getOne(uid, null);

    if (!user) {
      req.logger.warning(`no se encontro el usuario con el id ${cid}`);
      CustomError.createError({
        name: "Error, no se encontro el usuario",
        cause: "No existe ese usuario en la base de datos",
        message: `no se encontro el usuario con el id ${cid}`,
        code: enumErrors.INVALID_TYPES_ERROR,
      });
    }

    let cartExists = user.cart.find((el) => el._id == cid);
    if (cartExists) {
      req.logger.warning(`Ya existe el carrito con el id ${cid}`);
      CustomError.createError({
        name: "Error, carrito existente",
        cause: "Ya existe ese carrito en la base de datos",
        message: `Ya existe el carrito con el id ${cid}`,
        code: enumErrors.INVALID_TYPES_ERROR,
      });
    }

    user.cart.push(cart._id);
    cart.users.push(user._id);

    await insCart.updateCart(cid, cart);
    await userService.updateUserById(uid, user);

    res.json({ status: "Success", message: "user add to cart", payload: cart });
  } catch (err) {
    next(err);
  }
};

const changeRole = async (req, res, next) => {
  try {
    const { uid } = req.params;
    const user = await userService.getOne(uid, null);

    if (user.role === "usuario")
      await userService.updateUserById(uid, { role: "premium" });
    else await userService.updateUserById(uid, { role: "usuario" });

    res.json({ status: "Success", message: "Rol cambiado exitosamente" });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { uid } = req.params;
    const user = await userService.deleteUser(uid, null);

    if (!user) return res.json({ status: "Error", error: "Usuario no existe" });

    res.json({ status: "Success", message: "Usuario eliminado correctamente" });
  } catch (err) {
    next(err);
  }
};

const uploadUser = async (req, res, next) => {
  try {
    const { uid } = req.params;
    const user = await userService.deleteUser(uid, null);

    if (!user) return res.json({ status: "Error", error: "Usuario no existe" });

    if (!req.file)
      return res.json({ status: "Error", error: "no se subio ningun archivo" });

    const documentsUser = {
      name: req.file.originalname,
      reference: req.file.path,
    };

    await userService.updateUserById(uid, { documents: documentsUser });

    res.json({
      status: "Success",
      message: "se subio correctamente el archivo",
    });
  } catch (err) {
    next(err);
  }
};

const deleteUsersInactivity = async (req, res, next) => {
  try {
    const users = await userService.getAll();

    const deletedUsers = [];

    users.forEach((user) => {
      const dateOne = user.last_connection;

      const dateTwo = new Date().getTime();

      const diff = dateTwo - dateOne;

      const days = diff / (1000 * 60 * 60 * 24);

      if (days >= 2) {
        deletedUsers.push(user);
      }
    });

    if (deletedUsers.length === 0) {
      return res.json({
        status: "Error",
        error: "No hay ningun usuario inactivo",
      });
    }

    deletedUsers.forEach(async (user) => {
      await userService.deleteUser(user._id, null);
      await transport.sendMail({
        from: "santiaaquino4@gmail.com",
        to: user.email,
        subject: "Eliminacion de cuenta de Ecommerce",
        html: `Hola ${user.first_name} ${user.last_name}, le informamos que su cuenta fue eliminado del ecommerce por inactividad
              le dejamos este link <a href="http://localhost:3000/register">aqui</a> por si quiere volver a registrarse `,
      });
    });

    res.json({ status: "success!" });
  } catch (err) {
    next(err);
  }
};

const changeRoleByAdmin = async (req, res, next) => {
  const { uid, role } = req.params;

  await userService.changeRoleByAdmin(uid, role);

  res.json({ status: "success", message: "El rol fue cambiado correctamente" });
};

export default {
  getAll,
  createUser,
  updates,
  changeRole,
  deleteUser,
  uploadUser,
  deleteUsersInactivity,
  changeRoleByAdmin,
};
