import mongoose, { Document, Schema } from "mongoose";

export interface IMessage extends Document {
  sender_id: string;
  recipient_id: string;
  content: string;
  timestamp: Date;
  status: "Delivered" | "Read";
}

const MessageSchema: Schema = new Schema({
  sender_id: { type: String, required: true },
  recipient_id: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ["Delivered", "Read"], default: "Delivered" },
});

const Message = mongoose.model<IMessage>("Message", MessageSchema);
export default Message;

//functions
export const createMessage = async (
  messageData: Partial<IMessage>
): Promise<IMessage> => {
  try {
    const message = await new Message(messageData).save();
    return message.toObject();
  } catch (error) {
    throw new Error("Failed to create message");
  }
};

export const getMessageById = async (
  messageId: string
): Promise<IMessage | null> => {
  try {
    const message = await Message.findById(messageId);
    return message ? message.toObject() : null;
  } catch (error) {
    throw new Error("Failed to get message by ID");
  }
};

export const updateMessageById = async (
  messageId: string,
  updateData: Partial<IMessage>
): Promise<IMessage | null> => {
  try {
    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      updateData,
      { new: true }
    );
    return updatedMessage ? updatedMessage.toObject() : null;
  } catch (error) {
    throw new Error("Failed to update message by ID");
  }
};

export const deleteMessageById = async (messageId: string): Promise<void> => {
  try {
    await Message.findByIdAndDelete(messageId);
  } catch (error) {
    throw new Error("Failed to delete message by ID");
  }
};
