import { MessageModel } from "../models/Message.js";

export class MessageRepo {
  static async addMessage(message) {
    try {
      const newMessage = await MessageModel.create({
        ...message,
      });
      return newMessage;
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  }

  static async getMessagesByChatId(chat_id) {
    try {
      const messages = await MessageModel.find({ chat_id: chat_id });
      if (messages) return messages;
      else return null;
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  }

  static async getMessagesBySenderId(sender_id) {
    try {
      const messages = await MessageModel.find({ sender_id: sender_id });
      if (messages) return messages;
      else return null;
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  }

  static async getMessagesByRecipientId(recipient_id) {
    try {
      const messages = await MessageModel.find({ recipient_id: recipient_id });
      if (messages) return messages;
      else return null;
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  }
}
