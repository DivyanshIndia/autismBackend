import express from "express";
import {
  createConversation,
  getConversationById,
  updateConversationById,
  deleteConversationById,
  getMessagesForConversation,
} from "./conversation.model";

// Create a conversation
export const createConversationController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const conversationData = req.body;
    const conversation = await createConversation(conversationData);
    return res.status(201).json(conversation);
  } catch (error) {
    console.error("Error creating conversation:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get a conversation by ID
export const getConversationByIdController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const conversation = await getConversationById(id);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    return res.status(200).json(conversation);
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update a conversation by ID
export const updateConversationByIdController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedConversation = await updateConversationById(id, updateData);
    if (!updatedConversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    return res.status(200).json(updatedConversation);
  } catch (error) {
    console.error("Error updating conversation:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a conversation by ID
export const deleteConversationByIdController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    await deleteConversationById(id);
    return res
      .status(200)
      .json({ message: "Conversation deleted successfully" });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get messages for a conversation
export const getMessagesForConversationController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const messages = await getMessagesForConversation(id);
    return res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages for conversation:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
