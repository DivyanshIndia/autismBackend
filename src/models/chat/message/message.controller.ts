import express from "express";
import {
  createMessage,
  getMessageById,
  updateMessageById,
  deleteMessageById,
} from "./message.model";

// Create a message
export const createMessageController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const messageData = req.body;
    const message = await createMessage(messageData);
    return res.status(201).json(message);
  } catch (error) {
    console.error("Error creating message:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get a message by ID
export const getMessageByIdController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const message = await getMessageById(id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    return res.status(200).json(message);
  } catch (error) {
    console.error("Error fetching message:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update a message by ID
export const updateMessageByIdController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedMessage = await updateMessageById(id, updateData);
    if (!updatedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }
    return res.status(200).json(updatedMessage);
  } catch (error) {
    console.error("Error updating message:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a message by ID
export const deleteMessageByIdController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    await deleteMessageById(id);
    return res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
