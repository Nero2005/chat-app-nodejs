import { UserModel } from "../models/User.js";

export class UserRepo {
  static async createUser(userDetails) {
    try {
      const { name, email, password } = userDetails;
      const newUser = await UserModel.create({ name, email, password });
      return newUser;
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  }

  static async findUserById(id) {
    try {
      const foundUser = await UserModel.findById(id);
      if (foundUser) return foundUser;
      else return null;
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  }

  static async findUserByEmail(email) {
    try {
      const foundUser = await UserModel.findOne({ email: email });
      if (foundUser) return foundUser;
      else return null;
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  }

  static async addChatToUser(id, chat_id) {
    try {
      const foundUser = await this.findUserById(id);
      foundUser.chats.push(chat_id);
      await foundUser.save();
      return foundUser.chats;
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  }
}
