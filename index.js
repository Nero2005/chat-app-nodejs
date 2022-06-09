import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import helmet from "helmet";
import logger from "morgan";
import cors from "cors";
import { dbConnection } from "./database/connection.js";
import { UserRouter } from "./routes/UserRouter.js";

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(UserRouter);

const httpServer = http.createServer(app);
global.io = new Server(httpServer);
global.io.on("connection", () => {
  console.log("A user has connected");
});

const PORT = process.env.PORT || 5000;

app.use("/", (req, res) => {
  res.json({ message: "url not found" });
});

httpServer.listen(PORT, async () => {
  await dbConnection();
  console.log(`Server listening on port ${PORT}`);
});
