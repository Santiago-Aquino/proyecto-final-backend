import express from "express";
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import MessagesManager from "./dao/dbManagers/messages.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import cookieParser from "cookie-parser";
import config from "./config/config.js";
import cors from "cors";
import { Router } from "./routes/index.router.js";
import errorHandle from "./customError/middlewares/errors/index.js";
import { addLogger } from "./logs/logger.js";
import { logger } from "./logs/logger.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

// swagger
const swaggerOption = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentacion de las APIs",
      description: "APIs que contiene nuestro proyecto",
    },
  },
  apis: [`${__dirname}/docs/*.yaml`],
};
const specs = swaggerJSDoc(swaggerOption);

const ins = new MessagesManager();

logger.info(
  `\n"port": ${config.port}\n"mongoName": ${config.mongoName}\n"persistence": ${config.persistence}\n`
);

// server
const app = express();
const PORT = config.port || 8080;
const http = app.listen(PORT, () =>
  logger.info(`Server listening in port ${PORT}\n`)
);
const io = new Server(http);

// passport y cookie
initializePassport();
app.use(passport.initialize());
app.use(cookieParser());
app.use(cors());

// uso
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));

//logger
app.use(addLogger);

// router
app.use("/", Router);
// errors
app.use(errorHandle);

// swagger
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

// chat
io.on("connection", (socket) => {
  socket.on("message", async (data) => {
    await ins.saveMessage(data);
    const messages = await ins.getAll();
    io.emit("returnMessage", messages);
  });

  socket.on("delete", async () => {
    await ins.deleteMessages();
    io.emit("returnDelete", "");
  });
});
