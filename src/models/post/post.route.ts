import express from "express";

import { isAuthenticated, isOwner, isPostOwner } from "../../middleware";
import {
  getAllPosts,
  addPost,
  editPost,
  getPostsOfUser,
  deletePost,
  getUpvoteCount,
  upvotePost,
  getPostsCountOfAuthor
} from "./post.controller";

export default (router: express.Router) => {
  router.get("/posts", isAuthenticated, getAllPosts);
  router.get("/users/:userId/posts", isAuthenticated, getPostsOfUser);

  router.post("/posts", isAuthenticated, addPost);
  router.patch("/posts/:id", isAuthenticated, isPostOwner, editPost);
  router.delete("/posts/:id", isAuthenticated, isPostOwner, deletePost);

  router.get("/posts/:id/upvote-count", isAuthenticated, getUpvoteCount);
  router.post("/posts/:id/upvote", isAuthenticated, upvotePost);
  router.get("/users/:userId/posts/count", isAuthenticated, getPostsCountOfAuthor);

};
