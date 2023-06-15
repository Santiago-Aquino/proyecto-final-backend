import dotenv from "dotenv";
// DEVELOPMENT
// PRODUCTION

export const enviroment = "PRODUCTION";
dotenv.config({
  path:
    enviroment === "DEVELOPMENT" ? "./.env.development" : "./.env.production",
});

export default {
  port: process.env.PORT,
  mongo: process.env.MONGO_URL,
  mongoName: process.env.MONGO_NAME,
  token: process.env.TOKEN,
  cookie: process.env.COOKIE,
  admin: process.env.ADMIN,
  adminPass: process.env.ADMIN_PASS,
  persistence: process.env.PERSISTENCE,
  tokenRestore: process.env.TOKEN_RESTORE,
  carritoTest: process.env.CARRITO_TEST,
};
