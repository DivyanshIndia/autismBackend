import express from "express";
import {
  getAllComments,
  addComment,
  replyToComment,
  editComment,
  getCommentsOfPost,
} from "./comment.controller";

import { isAuthenticated } from "../../middleware";

export default (router: express.Router) => {
  router.get("/comments", isAuthenticated, getAllComments); // Route for getting all comments
  router.get("/posts/:id/comments", isAuthenticated, getCommentsOfPost); // New route

  router.post("/posts/:id/comments", isAuthenticated, addComment); // Route for adding a comment to a post
  router.post("/comments/:commentId/reply", isAuthenticated, replyToComment); // Route for replying to a comment
  router.patch("/comments/:commentId", isAuthenticated, editComment); // Route for editing a comment
};
