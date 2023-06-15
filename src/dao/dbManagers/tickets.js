import { ticketModel } from '../models/tickets.model.js';

export default class TicketsManager {
  constructor() {
    //console.log('Usermanager');
  }

  getAll = async () => {
    try {
      const tickets = await ticketModel.find();
      return tickets;
    }
    catch (err) {
      throw new Error(err);
    }
  };

  getOne = async (id, email) => {
    try {
      const ticketId = await ticketModel.findOne({ _id: id });
      const ticketEmail = await ticketModel.findOne({ email: email });
      return ticketId || ticketEmail;
    }
    catch (err) {
      throw new Error(err);
    }
  };

  updateTicket = async (email, valor) => {
    try {
      const ticket = await ticketModel.updateOne({ email: email }, { $set: valor });
      return ticket;
    }
    catch (err) {
      throw new Error(err);
    }
  };

  updateTicketById = async (id, valor) => {
    try {
      const ticket = await ticketModel.updateOne({ _id: id }, { $set: valor });
      return ticket;
    }
    catch (err) {
      throw new Error(err);
    }
  };

  createTicket = async (obj) => {
    try {
      const result = await ticketModel.create(obj);
      return result;
    }
    catch (err) {
      throw new Error(err);
    }
  };
}
