import express from "express";
import Comment, {
  createComment,
  getCommentById,
} from "../comment/comment.model";
import Post, { getPostById } from "../post/post.model";
import { get } from "lodash";

// Get all comments
export const getAllComments = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const comments = await Comment.find()
      .populate("author", "username")
      .populate("post");
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getNestedComments = async (commentId: string) => {
  let comment = await Comment.findById(commentId)
    .populate("author", "username profilePicture fullName")
    .populate({
      path: "replies",
      populate: { path: "author", select: "username profilePicture fullName" },
    });

  if (comment) {
    comment = comment.toObject(); // Convert to a plain object if it's a Mongoose document
    for (let i = 0; i < comment.replies.length; i++) {
      comment.replies[i] = await getNestedComments(comment.replies[i]._id);
    }
  }
  return comment;
};

export const getCommentsOfPost = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    // Fetch only top-level comments (comments without a parentComment)
    let topLevelComments = await Comment.find({
      post: id,
      parentComment: { $exists: false },
    }).populate("author", "username profilePicture fullName");

    // Recursively fetch and structure all nested replies
    let nestedComments = await Promise.all(
      topLevelComments.map((comment) => getNestedComments(comment._id))
    );
    res.status(200).json(nestedComments);
  } catch (error) {
    console.error("Error fetching nested comments for post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add a comment to a post
export const addComment = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const author = get(req, "identity._id") as string;

    const post = await getPostById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = await createComment({ content, author, post: id });

    post.comments.push(newComment._id);
    await post.save();

    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Reply to a comment
export const replyToComment = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const author = get(req, "identity._id") as string;

    const parentComment = await getCommentById(commentId);
    if (!parentComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const replyComment = await createComment({
      content,
      author,
      post: parentComment.post,
      parentComment: parentComment._id, // Set the parentComment ID
    });

    parentComment.replies.push(replyComment._id);
    await parentComment.save();

    res.status(201).json(replyComment);
  } catch (error) {
    console.error("Error replying to comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Edit a comment
export const editComment = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = get(req, "identity._id") as string;

    const comment = await getCommentById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if the current user is the author of the comment
    if (comment.author.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You can only edit your own comments" });
    }

    comment.content = content;
    await comment.save();

    res.status(200).json(comment);
  } catch (error) {
    console.error("Error editing comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
