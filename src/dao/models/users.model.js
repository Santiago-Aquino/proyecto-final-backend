import mongoose from "mongoose";

const collection = "users";
const schema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  cart: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts",
      },
    ],
    default: [],
  },
  role: {
    type: String,
    enum: ["usuario", "admin"],
    default: "usuario",
  },
  documents: {
    type: Array,
    default: [],
  },
  last_connection: {
    type: Number,
  },
});

schema.pre("find", function () {
  this.populate("cart");
});

export const usersModel = new mongoose.model(collection, schema);
