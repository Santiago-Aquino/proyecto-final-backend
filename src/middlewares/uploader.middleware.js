import multer from "multer";
import __dirname from "../utils.js";

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    cb(null, __dirname + "../public/upload");
  },

  filename: async (req, file, cb) => {
    cd(null, file.originalname);
  },
});

export const uploader = multer({ storage });
