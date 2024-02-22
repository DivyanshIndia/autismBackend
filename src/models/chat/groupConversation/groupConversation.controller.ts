import express from "express";
import {
  createGroupConversation,
  getGroupConversationById,
  updateGroupConversationById,
  deleteGroupConversationById,
} from "./groupConversation.model";

// Create a group conversation
export const createGroupConversationController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const groupConversationData = req.body;
    const groupConversation = await createGroupConversation(
      groupConversationData
    );
    return res.status(201).json(groupConversation);
  } catch (error) {
    console.error("Error creating group conversation:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get a group conversation by ID
export const getGroupConversationByIdController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const groupConversation = await getGroupConversationById(id);
    if (!groupConversation) {
      return res.status(404).json({ message: "Group conversation not found" });
    }
    return res.status(200).json(groupConversation);
  } catch (error) {
    console.error("Error fetching group conversation:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update a group conversation by ID
export const updateGroupConversationByIdController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedGroupConversation = await updateGroupConversationById(
      id,
      updateData
    );
    if (!updatedGroupConversation) {
      return res.status(404).json({ message: "Group conversation not found" });
    }
    return res.status(200).json(updatedGroupConversation);
  } catch (error) {
    console.error("Error updating group conversation:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a group conversation by ID
export const deleteGroupConversationByIdController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    await deleteGroupConversationById(id);
    return res
      .status(200)
      .json({ message: "Group conversation deleted successfully" });
  } catch (error) {
    console.error("Error deleting group conversation:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
