import mongoose from "mongoose";

const collection = 'messages';
const schema = new mongoose.Schema({
  user: String,
  message: String
});

export const messagesModel = new mongoose.model(collection, schema);