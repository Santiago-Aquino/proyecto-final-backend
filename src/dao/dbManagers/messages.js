import { messagesModel } from '../models/messages.model.js';

export default class MessagesManager {
  constructor() {
    //console.log('Nueva clase para el manejo de mensajes');
  }

  saveMessage = async (message) => {
    try {
      const newMessage = await messagesModel.create(message);
      return newMessage;
    }
    catch (err) {
      throw new Error(err);
    }
  };

  getAll = async () => {
    try {
      const messages = await messagesModel.find();
      return messages;
    }
    catch (err) {
      throw new Error(err);
    }
  };

  deleteMessages = async () => {
    await messagesModel.deleteMany({});
  };
}