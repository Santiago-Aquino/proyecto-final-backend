import winston from "winston";
import { enviroment } from "../config/config.js";

const customLevelColorOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "magenta",
    warning: "yellow",
    info: "blue",
    http: "cyan",
    debug: "white",
  },
};

export let logger;

if (enviroment === "DEVELOPMENT") {
  logger = winston.createLogger({
    levels: customLevelColorOptions.levels,
    transports: [
      new winston.transports.Console({
        level: "debug",
        format: winston.format.combine(
          winston.format.colorize({ colors: customLevelColorOptions.colors }),
          winston.format.simple()
        ),
      }),
    ],
  });
} else {
  logger = winston.createLogger({
    levels: customLevelColorOptions.levels,
    transports: [
      new winston.transports.Console({
        level: "info",
        format: winston.format.combine(
          winston.format.colorize({ colors: customLevelColorOptions.colors }),
          winston.format.simple()
        ),
      }),

      new winston.transports.File({
        filename: "./src/logs/errors.log",
        level: "error",
        format: winston.format.simple(),
      }),
    ],
  });
}

export const addLogger = (req, res, next) => {
  req.logger = logger;
  next();
};
