import express from "express";
import {
  deleteUserById,
  getUsers,
  getUserById,
  updateUserById,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  isFollowingUser,
} from "../user/user.model";
import { get } from "lodash";

// Get all users
export const getAllUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const users = await getUsers();
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// get a user
export const getUserByIdController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a user
export const deleteUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;

    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await deleteUserById(id);
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update a user
export const updateUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await updateUserById(id, updateData);
    const updatedUser = await getUserById(id);
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const followUserController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const userId = get(req, "identity._id") as string;
    const targetUserId = req.params.id;
    await followUser(userId, targetUserId);
    res.status(200).json({ message: "Followed successfully" });
  } catch (error) {
    console.error("Error following user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const unfollowUserController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const userId = get(req, "identity._id") as string;
    const targetUserId = req.params.id;
    await unfollowUser(userId, targetUserId);
    res.status(200).json({ message: "Unfollowed successfully" });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getFollowersController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const userId = req.params.id;
    const followers = await getFollowers(userId);
    res.status(200).json(followers?.followers);
  } catch (error) {
    console.error("Error fetching followers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getFollowingController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const userId = req.params.id;
    const following = await getFollowing(userId);
    res.status(200).json(following?.following);
  } catch (error) {
    console.error("Error fetching following:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// import other necessary modules and functions

// Check if a user is following another user
export const isFollowingController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const userId = get(req, "identity._id") as string;
    const targetUserId = req.params.id;

    // Call the isFollowingUserController
    const result = await isFollowingUser(userId, targetUserId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in isFollowingController:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ... (other controller functions)
