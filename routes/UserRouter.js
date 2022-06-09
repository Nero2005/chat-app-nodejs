import express from "express";
import { User } from "../controllers/user.js";
import { authToken } from "../controllers/middlewares/auth.js";

const UserRouter = express.Router();

UserRouter.route("/users/register").post(User.register);

UserRouter.route("/users/login").post(User.login);

UserRouter.route("/users/logout").post(User.logout);

UserRouter.route("/users/get_user").get(authToken, User.getUser);

UserRouter.route("/users/get_user_by_email").post(
  authToken,
  User.getUserByEmail
);

UserRouter.route("/users/get_all_chats").get(authToken, User.getAllChats);

UserRouter.route("/users/get_chats").post(authToken, User.getChatById);

UserRouter.route("/users/send_message").post(authToken, User.sendMessage);

export { UserRouter };
