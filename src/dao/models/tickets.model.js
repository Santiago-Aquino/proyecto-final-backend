import mongoose from "mongoose";

const collection = 'tickets';
const schema = new mongoose.Schema({
  code: String,
  purchase_datetime: String,
  amount: Number,
  purchaser: String
});

schema.pre('find', function () {
  this.populate();
});

export const ticketModel = new mongoose.model(collection, schema);
