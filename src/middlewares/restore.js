import UsersManager from "../dao/dbManagers/users.js";

const insUser = new UsersManager();

export const restoreUser = async (req, res, next) => {
  req.logger.debug("Estoy en el middleware del restore");
  const { email } = req.body;

  if (!email)
    return res.json({
      status: "Error",
      error: "Ingrese el email para reestablecer",
    });

  req.logger.debug(email);

  try {
    const user = await insUser.getOne(null, email);
    if (!user) {
      req.logger.info("El usuario no existe");
      return res.json({ status: "Error", error: "El usuario no existe" });
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
