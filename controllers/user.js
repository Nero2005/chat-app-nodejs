import { UserService } from "../services/UserService.js";
import { MessageService } from "../services/MessageService.js";
import { MessageRepo } from "../database/repo/MessageRepo.js";

export class User {
  static async register(req, res) {
    try {
      const { message, name, email, token, code } =
        await UserService.registerUser(req.body);
      if (code == 201) {
        res.cookie("chatToken", token, {
          maxAge: 1 * 24 * 60 * 60 * 1000,
          httpOnly: true,
        });
        res.status(code).json({ message, name, email, token });
      } else {
        // 400
        res.status(500).json({ error: "Error registering user" });
      }
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  }

  static async login(req, res) {
    const { message, code, token } = await UserService.loginUser(req.body);
    switch (code) {
      case 200:
        res.cookie("chatToken", token, {
          maxAge: 1 * 24 * 60 * 60 * 1000,
          httpOnly: true,
        });
        res.status(code).json({ message, token });
        break;
      case 400:
        res.status(code).json(message);
        break;
      case 404:
        res.status(code).json(message);
        break;
      default:
        res.status(500).json({ error: "Error logging in user!" });
        break;
    }
  }

  static async logout(req, res) {
    res.status(200).json("Successfully Logged out!");
  }

  static async getUser(req, res) {
    const { user, code } = await UserService.getUser(req.user.id);
    if (code == 200) {
      res.status(code).json(user);
    }
  }

  static async getUserByEmail(req, res) {
    const { user, code } = await UserService.getUserByEmail(req.body.email);
    if (code == 200) {
      res.status(code).json(user);
    }
  }

  static async getAllChats(req, res) {
    const { chats, code } = await UserService.getAllChats(req.user.id);
    if (code == 200) {
      res.status(code).json(chats);
    } else {
      res.status(500).json({ error: "Error getting chats!" });
    }
  }

  static async getChatById(req, res) {
    const messages = await MessageService.getMessagesByChatId(
      req.user.id,
      req.body.chat_id,
      req.body.recipient_id
    );
    if (!messages) return res.status(404).json({ message: "No messages yet" });
    return res.status(200).json(messages);
  }

  static async sendMessage(req, res) {
    const { msg, chat_id, code } = await MessageService.sendMessage({
      ...req.body,
      sender_id: req.user.id,
    });
    if (code == 200) {
      global.io.emit("new message", { chat_id, msg });
      res.status(code).json(msg);
    } else {
      res.status(500).json({ error: "Error sending message" });
    }
  }
}
