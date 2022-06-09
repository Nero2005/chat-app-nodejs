import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ChatSchema = new Schema(
  {
    chat_id: { type: String, unique: true },
    messages: { type: [Schema.Types.ObjectId], ref: "messages" },
  },
  {
    timestamps: true,
    collection: "chats",
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      },
    },
  }
);

export const ChatModel = mongoose.model("Chat", ChatSchema);
