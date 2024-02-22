import express from "express";
import {
  createGroup,
  getGroupById,
  updateGroupById,
  deleteGroupById,
} from "./group.model";

// Create a group
export const createGroupController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const groupData = req.body;
    const group = await createGroup(groupData);
    return res.status(201).json(group);
  } catch (error) {
    console.error("Error creating group:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get a group by ID
export const getGroupByIdController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const group = await getGroupById(id);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    return res.status(200).json(group);
  } catch (error) {
    console.error("Error fetching group:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update a group by ID
export const updateGroupByIdController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedGroup = await updateGroupById(id, updateData);
    if (!updatedGroup) {
      return res.status(404).json({ message: "Group not found" });
    }
    return res.status(200).json(updatedGroup);
  } catch (error) {
    console.error("Error updating group:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a group by ID
export const deleteGroupByIdController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    await deleteGroupById(id);
    return res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
    console.error("Error deleting group:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
