import mongoose, { Document, Schema } from "mongoose";

export interface IGroup extends Document {
  name: string;
  participants: string[];
  creator_id: string;
  created_at: Date;
}

const GroupSchema: Schema = new Schema({
  name: { type: String, required: true },
  participants: [{ type: String }],
  creator_id: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const Group = mongoose.model<IGroup>("Group", GroupSchema);
export default Group;

//functions
export const createGroup = async (
  groupData: Partial<IGroup>
): Promise<IGroup> => {
  try {
    const group = await new Group(groupData).save();
    return group.toObject();
  } catch (error) {
    throw new Error("Failed to create group");
  }
};

export const getGroupById = async (groupId: string): Promise<IGroup | null> => {
  try {
    const group = await Group.findById(groupId);
    return group ? group.toObject() : null;
  } catch (error) {
    throw new Error("Failed to get group by ID");
  }
};

export const updateGroupById = async (
  groupId: string,
  updateData: Partial<IGroup>
): Promise<IGroup | null> => {
  try {
    const updatedGroup = await Group.findByIdAndUpdate(groupId, updateData, {
      new: true,
    });
    return updatedGroup ? updatedGroup.toObject() : null;
  } catch (error) {
    throw new Error("Failed to update group by ID");
  }
};

export const deleteGroupById = async (groupId: string): Promise<void> => {
  try {
    await Group.findByIdAndDelete(groupId);
  } catch (error) {
    throw new Error("Failed to delete group by ID");
  }
};
