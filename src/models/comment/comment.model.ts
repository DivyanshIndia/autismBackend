import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "../user/user.model";
import { IPost } from "../post/post.model";

export interface IComment extends Document {
  content: string;
  author: IUser["_id"];
  post: IPost["_id"];
  replies: IComment["_id"][];
  parentComment?: IComment["_id"];
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema: Schema = new Schema(
  {
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    replies: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      required: false,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model<IComment>("Comment", CommentSchema);
export default Comment;

export const getComments = () =>
  Comment.find().populate("author", "username profilePicture fullName");
export const getCommentById = (id: string) =>
  Comment.findById(id).populate("author", "username profilePicture fullName");
export const createComment = (comment: Record<string, any>) =>
  new Comment(comment).save().then((comment) => comment.toObject());
export const getCommentsByPostId = (postId: string) => {
  return Comment.find({ post: postId }).populate(
    "author",
    "username profilePicture fullName"
  );
};
