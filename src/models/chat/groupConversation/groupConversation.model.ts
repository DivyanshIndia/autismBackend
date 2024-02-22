import mongoose, { Document, Schema } from "mongoose";
import { IMessage } from "../message/message.model";
import { IGroup } from "../group/group.model";

export interface IConversation extends Document {
  group: IGroup["_id"];
  messages: IMessage[];
}

const ConversationSchema: Schema = new Schema({
  group: { type: Schema.Types.ObjectId, ref: "Group", required: true },
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
});

const GroupConversation = mongoose.model<IConversation>(
  "GroupConverstation",
  ConversationSchema
);

export default GroupConversation;

//functions
export const createGroupConversation = async (
  groupConversationData: Partial<IConversation>
): Promise<IConversation> => {
  try {
    const groupConversation = await new GroupConversation(
      groupConversationData
    ).save();
    return groupConversation.toObject();
  } catch (error) {
    throw new Error("Failed to create group conversation");
  }
};

export const getGroupConversationById = async (
  groupConversationId: string
): Promise<IConversation | null> => {
  try {
    const groupConversation = await GroupConversation.findById(
      groupConversationId
    );
    return groupConversation ? groupConversation.toObject() : null;
  } catch (error) {
    throw new Error("Failed to get group conversation by ID");
  }
};

export const updateGroupConversationById = async (
  groupConversationId: string,
  updateData: Partial<IConversation>
): Promise<IConversation | null> => {
  try {
    const updatedGroupConversation = await GroupConversation.findByIdAndUpdate(
      groupConversationId,
      updateData,
      { new: true }
    );
    return updatedGroupConversation
      ? updatedGroupConversation.toObject()
      : null;
  } catch (error) {
    throw new Error("Failed to update group conversation by ID");
  }
};

export const deleteGroupConversationById = async (
  groupConversationId: string
): Promise<void> => {
  try {
    await GroupConversation.findByIdAndDelete(groupConversationId);
  } catch (error) {
    throw new Error("Failed to delete group conversation by ID");
  }
};
