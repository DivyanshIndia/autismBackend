import express from "express";
import {
  createGroupConversationController,
  getGroupConversationByIdController,
  updateGroupConversationByIdController,
  deleteGroupConversationByIdController,
} from "./groupConversation.controller";
import { isAuthenticated } from "../../../middleware";

export default (router: express.Router) => {
  // Route to create a new group conversation
  router.post(
    "/group-conversations",
    isAuthenticated,
    createGroupConversationController
  );

  // Route to get a group conversation by its ID
  router.get(
    "/group-conversations/:id",
    isAuthenticated,
    getGroupConversationByIdController
  );

  // Route to update a group conversation by its ID
  router.patch(
    "/group-conversations/:id",
    isAuthenticated,
    updateGroupConversationByIdController
  );

  // Route to delete a group conversation by its ID
  router.delete(
    "/group-conversations/:id",
    isAuthenticated,
    deleteGroupConversationByIdController
  );
};
