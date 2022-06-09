import { ChatModel } from "../database/models/Chat.js";
import { MessageRepo } from "../database/repo/MessageRepo.js";
import { UserRepo } from "../database/repo/UserRepo.js";
import { genChatId, getChatId } from "../utils/index.js";

export class MessageService {
  static async createChat(user_id, recipient_id) {
    const newChat = await ChatModel.create({ chat_id: genChatId() });
    const chat_id = newChat.chat_id;
    await UserRepo.addChatToUser(user_id, chat_id);
    await UserRepo.addChatToUser(recipient_id, chat_id);
    // return { newChat, userChats, code: 200 };
    return chat_id;
  }
  static async sendMessage(message) {
    try {
      const { msg, recipient_id, chat_id, sender_id } = message;
      const newMessage = await MessageRepo.addMessage({
        msg,
        sender_id,
        recipient_id,
        chat_id,
      });
      const chat = await ChatModel.findOne({ chat_id: chat_id });
      chat.messages.push(newMessage._id);
      await chat.save();

      console.log(newMessage);
      return { ...newMessage._doc, code: 200 };

      // if (getChatId(sender_id, recipient_id)) {
      //   const chat_id = getChatId(sender_id, recipient_id);
      //   const newMessage = await MessageRepo.addMessage({
      //     msg,
      //     sender_id,
      //     recipient_id,
      //     chat_id,
      //   });
      //   return { ...newMessage, code: 200 };
      // } else {
      //   const chat_id = genChatId();
      //   const newMessage = await MessageRepo.addMessage({
      //     msg,
      //     sender_id,
      //     recipient_id,
      //     chat_id,
      //   });
      //   const userChats = await UserRepo.addChatToUser(sender_id, chat_id);
      //   return { ...newMessage, userChats, code: 200 };
      // }
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  }

  static async getMessagesByChatId(user_id, chat_id, recipient_id) {
    if (!chat_id) {
      chat_id = await this.createChat(user_id, recipient_id);
    }
    const messages = await MessageRepo.getMessagesByChatId(chat_id);
    if (!messages) return { message: "No chats yet!", code: 404 };
    return { messages, chat_id, code: 200 };
    // if (getChatId(sender_id, recipient_id)) {
    //   const chat_id = getChatId(sender_id, recipient_id);
    //   const messages = await MessageRepo.getMessagesByChatId(chat_id);
    //   return { messages, code: 200 };
    // } else {
    //   return { message: "No chats yet!", code: 404 };
    // }
  }

  // static async getMessagesByChatId(sender_id, recipient_id) {
  //   if (getChatId(sender_id, recipient_id)) {
  //     const chat_id = getChatId(sender_id, recipient_id);
  //     const messages = await MessageRepo.getMessagesByChatId(chat_id);
  //     return { messages, code: 200 };
  //   } else {
  //     return { message: "No chats yet!", code: 404 };
  //   }
  // }
}
