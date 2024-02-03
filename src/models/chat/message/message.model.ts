import mongoose, { Document, Schema, Model } from "mongoose";
import { IUser } from "../../user/user.model";
import { IChatRoom } from "../chatRoom/chatRoom.model";

type MessageContent = {
  text?: string;
  imageUrl?: string;
  videoUrl?: string;
};

export interface IMessage extends Document {
  sender: IUser["_id"];
  content: MessageContent;
  timestamp: Date;
  chatRoom: IChatRoom["_id"];
  readBy: IUser["_id"][];
}

const MessageSchema: Schema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: "User" },
  content: {
    text: { type: String },
    imageUrl: { type: String },
    videoUrl: { type: String },
  },
  timestamp: { type: Date, default: Date.now },
  chatRoom: { type: Schema.Types.ObjectId, ref: "ChatRoom" },
  readBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

 const Message: Model<IMessage> = mongoose.model<IMessage>(
  "Message",
  MessageSchema
);

export default Message;
