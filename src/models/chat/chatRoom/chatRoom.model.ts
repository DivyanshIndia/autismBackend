import mongoose, { Document, Schema, Model } from "mongoose";
import { IUser } from "../../user/user.model";


export interface IChatRoom extends Document {
  type: "global" | "private";
  participants: IUser["_id"][];
  createdAt: Date;
}

const ChatRoomSchema: Schema<IChatRoom> = new Schema({
  type: { type: String, required: true, enum: ["global", "private"] },
  participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

const ChatRoom: Model<IChatRoom> = mongoose.model<IChatRoom>(
  "ChatRoom",
  ChatRoomSchema
);

export default ChatRoom;
