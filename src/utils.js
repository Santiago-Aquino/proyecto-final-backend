import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import passport from "passport";
import { faker } from "@faker-js/faker";
import nodemailer from "nodemailer";
import multer from "multer";

//multer

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + "/public/upload");
  },

  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const uploader = multer({ storage });

//nodemailer

export const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: "santiaaquino4@gmail.com",
    pass: "jqaeddmjsvyevgmg",
  },
});

// faker
faker.locale = "es";

export const generateProducts = () => {
  let newProducts = [];

  for (let i = 0; i < 100; i++) {
    const newProduct = {
      _id: faker.database.mongodbObjectId(),
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      code: Date.now().toString(32),
      price: faker.commerce.price(),
      status: true,
      stock: parseInt(faker.random.numeric(1, { bannedDigits: ["0"] })),
      category: faker.commerce.department(),
      thumbnail: [],
    };
    newProducts.push(newProduct);
  }

  return newProducts;
};

// strategy
export const strategyPassport = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, function (err, user, info) {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({
          status: "Error",
          error: info.message ? info.message : info.toString(),
        });
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};

// bcrypt
export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (user, password) =>
  bcrypt.compareSync(password, user.password);

// dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;
