import express from "express";
import {
  createConversationController,
  getConversationByIdController,
  updateConversationByIdController,
  deleteConversationByIdController,
  getMessagesForConversationController,
} from "./conversation.controller";
import { isAuthenticated } from "../../../middleware";

export default (router: express.Router) => {
  // Create a conversation
  router.post("/conversations", isAuthenticated, createConversationController);

  // Get a conversation by ID
  router.get(
    "/conversations/:id",
    isAuthenticated,
    getConversationByIdController
  );

  // Update a conversation by ID using PATCH
  router.patch(
    "/conversations/:id",
    isAuthenticated,
    updateConversationByIdController
  );

  // Delete a conversation by ID
  router.delete(
    "/conversations/:id",
    isAuthenticated,
    deleteConversationByIdController
  );

  // Get messages for a conversation
  router.get(
    "/conversations/:id/messages",
    isAuthenticated,
    getMessagesForConversationController
  );
};
