import express from "express";
import {
  createMessageController,
  getMessageByIdController,
  updateMessageByIdController,
  deleteMessageByIdController,
} from "./message.controller";
import { isAuthenticated } from "../../../middleware";

export default (router: express.Router) => {
  // Create a message
  router.post("/messages", isAuthenticated, createMessageController);

  // Get a message by ID
  router.get("/messages/:id", isAuthenticated, getMessageByIdController);

  // Update a message by ID
  router.put("/messages/:id", isAuthenticated, updateMessageByIdController);

  // Delete a message by ID
  router.delete("/messages/:id", isAuthenticated, deleteMessageByIdController);
};
