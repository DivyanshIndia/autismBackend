import express from "express";
import Post, { IPost, editPostById } from "./post.model";
import User from "../user/user.model";
import { get } from "lodash";
import {
  createPost,
  getPosts,
  getPostsByAuthor,
  deletePostById,
  getPostById,
  getPostsCountByAuthor,
} from "./post.model";

// Get all posts
export const getAllPosts = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const posts = await getPosts();
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPostsOfUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { userId } = req.params;
    const posts = await getPostsByAuthor(userId);
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching user's posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create a post
export const addPost = async (req: express.Request, res: express.Response) => {
  try {
    const { content, images, videos } = req.body;
    const author = get(req, "identity._id") as string;

    const newPost = await createPost({ content, images, videos, author });
    res.status(201).json(newPost.author);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// delete post
export const deletePost = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    await deletePostById(id);
    res.status(204).send(); // No content for successful deletion
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Edit a post
export const editPost = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const { content, images, videos } = req.body;
    const post = await editPostById(id, { content, images, videos });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// upvote count
export const getUpvoteCount = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const post = await getPostById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const upvoteCount = post.upvotes.length;
    res.status(200).json({ upvoteCount });
  } catch (error) {
    console.error("Error fetching upvote count:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// upvote controller
export const upvotePost = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const userId = get(req, "identity._id") as string;

    const post = await getPostById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const { upvotes } = post;
    const userIndex = upvotes.indexOf(userId);

    if (userIndex === -1) {
      // User hasn't upvoted yet, add the upvote
      upvotes.push(userId);
      await editPostById(id, { upvotes });
      res.status(200).json({ message: "Upvote successful" });
    } else {
      // User has already upvoted, remove the upvote
      upvotes.splice(userIndex, 1);
      await editPostById(id, { upvotes });
      res.status(200).json({ message: "Upvote removed" });
    }
  } catch (error) {
    console.error("Error upvoting post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// get post count by author

export const getPostsCountOfAuthor = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { userId } = req.params;
    const postCount = await getPostsCountByAuthor(userId);
    res.status(200).json({ postCount });
  } catch (error) {
    console.error("Error fetching user's post count:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
