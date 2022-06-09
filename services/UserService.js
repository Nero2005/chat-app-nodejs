import { UserRepo } from "../database/repo/UserRepo.js";
import { MessageRepo } from "../database/repo/MessageRepo.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export class UserService {
  static async registerUser(userDetails) {
    try {
      const { name, email, password } = userDetails;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const userExists = await UserRepo.findUserByEmail(email);
      if (userExists) return { message: "User already exists", code: 400 };
      const user = await UserRepo.createUser({
        name,
        email,
        password: hashedPassword,
      });
      const token = await jwt.sign(
        { email: user.email, name: user.name, id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      return {
        message: "Successfully registered",
        ...user._doc,
        token,
        code: 201,
      };
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  }

  static async loginUser(userDetails) {
    try {
      const { email, password } = userDetails;
      const user = await UserRepo.findUserByEmail(email);
      if (!user) return { message: "User not found!", code: 404 };
      const hashedPassword = user.password;
      const result = await bcrypt.compare(password, hashedPassword);
      if (!result) return { message: "Wrong password!", code: 400 };
      const token = await jwt.sign(
        { email: user.email, name: user.name, id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      return { message: "Login successful", code: 200, token };
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  }

  static async getUser(user_id) {
    try {
      const user = await UserRepo.findUserById(user_id);
      if (!user) return { message: "User not found!", code: 404 };
      return { user, message: "User found!", code: 200 };
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  }

  static async getUserByEmail(email) {
    try {
      const user = await UserRepo.findUserByEmail(email);
      if (!user) return { message: "User not found!", code: 404 };
      return { user, message: "User found!", code: 200 };
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  }

  static async getAllChats(user_id) {
    try {
      const user = await UserRepo.findUserById(user_id);
      return { chats: user.chats, code: 200 };
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  }
}
