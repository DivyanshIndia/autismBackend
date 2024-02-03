import express from "express";
import authentication from "../models/user/authentication.route";
import users from "../models/user/users.route";
import posts from "../models/post/post.route";
import comments from "../models/comment/comment.route";

const router = express.Router();

export default (): express.Router => {
  authentication(router);
  users(router);
  posts(router);
  comments(router);

  return router;
};
