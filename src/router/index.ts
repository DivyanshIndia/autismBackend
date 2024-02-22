import express from "express";
import authentication from "../models/user/authentication.route";
import users from "../models/user/users.route";
import posts from "../models/post/post.route";
import comments from "../models/comment/comment.route";
import message from "models/chat/message/message.route";
import conversation from "models/chat/conversation/conversation.route";
import groupConversation from "models/chat/groupConversation/groupConversation.route";
import group from "models/chat/group/group.route";

const router = express.Router();

export default (): express.Router => {
  authentication(router);
  users(router);
  posts(router);
  comments(router);
  message(router);
  conversation(router);
  groupConversation(router);
  group(router);

  return router;
};
