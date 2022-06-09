import mongoose from "mongoose";

const Schema = mongoose.Schema;
const MessageSchema = new Schema(
  {
    msg: { type: String },
    sender_id: { type: Schema.Types.ObjectId, ref: "users" },
    recipient_id: { type: Schema.Types.ObjectId, ref: "users" },
    chat_id: { type: String },
  },
  {
    timestamps: true,
    collection: "messages",
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      },
    },
  }
);

export const MessageModel = mongoose.model("Message", MessageSchema);
