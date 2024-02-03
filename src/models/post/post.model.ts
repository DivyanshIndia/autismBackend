import mongoose, { Document, Schema } from "mongoose";
import { IComment } from "../comment/comment.model";
import { IUser } from "../user/user.model";

export interface IPost extends Document {
  content: string;
  images: string[];
  videos: string[];
  author: IUser["_id"];
  upvotes: IUser["_id"][];
  downvotes: IUser["_id"][];
  comments: IComment["_id"][];
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema = new Schema(
  {
    content: { type: String, required: true },
    images: [{ type: String }],
    videos: [{ type: String }],
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    downvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

const Post = mongoose.model<IPost>("Post", PostSchema);
export default Post;

export const getPosts = () =>
  Post.find().populate("author", "username profilePicture fullName");
export const getPostById = (id: string) => Post.findById(id);
export const getPostsByAuthor = (authorId: string) => {
  return Post.find({ author: authorId })
    .populate("author", "username profilePicture fullName")
    .exec();
};

export const createPost = async (post: Record<string, any>) =>
  new Post(post).save().then((post) => post.toObject());
export const editPostById = (id: string, post: Record<string, any>) =>
  Post.findByIdAndUpdate(id, post, { new: true });

export const deletePostById = (id: string) => Post.findByIdAndDelete(id);

export const getPostsCountByAuthor = async (authorId: string) => {
  return Post.countDocuments({ author: authorId }).exec();
};
