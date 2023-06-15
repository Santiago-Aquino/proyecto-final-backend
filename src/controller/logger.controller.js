import CustomError from "../customError/customError.js";
import enumErrors from "../customError/enum.js";

const generateLogs = (req, res, next) => {
  try {
    if (!req.logger) {
      CustomError.createError({
        name: "Error no existe el logger",
        cause: "req.logger no esta funcionando",
        message: "No se pudieron traer los loggers",
        code: enumErrors.ROUTING_ERROR,
      });
    }
    req.logger.fatal("test - fatal");
    req.logger.error("test - error");
    req.logger.warning("test - warning");
    req.logger.info("test - info");
    req.logger.http("test - http");
    req.logger.debug("test - debug");

    res.json({ status: "Success!", message: "todos los logers" });
  } catch (err) {
    next(err);
  }
};

export default {
  generateLogs,
};
