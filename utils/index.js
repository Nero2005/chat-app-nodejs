import { MessageRepo } from "../database/repo/MessageRepo.js";
import otpGenerator from "otp-generator";

export const getChatId = async (sender_id, recipient_id) => {
  const senderMessages = await MessageRepo.getMessagesBySenderId(sender_id);
  const recipientMessages = await MessageRepo.getMessagesByRecipientId(
    sender_id
  );
  const foundSender = senderMessages.filter(
    (senderMsg) => senderMsg.recipient_id == recipient_id
  );
  const foundRecipient = recipientMessages.filter(
    (recipientMsg) => recipientMsg.sender_id == recipient_id
  );

  if (foundSender || foundRecipient) {
    return foundSender[0].chat_id || foundRecipient[0].chat_id;
  } else {
    return null;
  }
};

export const genChatId = () => {
  return otpGenerator.generate(10, {
    upperCaseAlphabets: false,
    specialChars: false,
  });
};
