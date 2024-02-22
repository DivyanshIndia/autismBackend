import mongoose, { Document, Schema } from "mongoose";
import { IMessage } from "../message/message.model";

export interface IConversation extends Document {
  participants: string[];
  messages: IMessage[];
}

const ConversationSchema: Schema = new Schema({
  participants: [{ type: String }],
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
});

const Conversation = mongoose.model<IConversation>(
  "Conversation",
  ConversationSchema
);
export default Conversation;


//functions
export const createConversation = async (
  conversationData: Partial<IConversation>
): Promise<IConversation> => {
  try {
    const conversation = await new Conversation(conversationData).save();
    return conversation.toObject();
  } catch (error) {
    throw new Error("Failed to create conversation");
  }
};

export const getConversationById = async (
  conversationId: string
): Promise<IConversation | null> => {
  try {
    const conversation = await Conversation.findById(conversationId);
    return conversation ? conversation.toObject() : null;
  } catch (error) {
    throw new Error("Failed to get conversation by ID");
  }
};

export const updateConversationById = async (
  conversationId: string,
  updateData: any
): Promise<IConversation | null> => {
  try {
    const updatedConversation = await Conversation.findByIdAndUpdate(
      conversationId,
      updateData,
      { new: true }
    );
    return updatedConversation ? updatedConversation.toObject() : null;
  } catch (error) {
    throw new Error("Failed to update conversation by ID");
  }
};

export const deleteConversationById = async (
  conversationId: string
): Promise<void> => {
  try {
    await Conversation.findByIdAndDelete(conversationId);
  } catch (error) {
    throw new Error("Failed to delete conversation by ID");
  }
};

export const getMessagesForConversation = async (
  conversationId: string
): Promise<IMessage[]> => {
  try {
    const conversation = await Conversation.findById(conversationId).populate(
      "messages"
    );
    return conversation ? conversation.messages : [];
  } catch (error) {
    throw new Error("Failed to get messages for conversation");
  }
};
