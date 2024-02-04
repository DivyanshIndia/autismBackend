import express from "express";

import {
  getAllUsers,
  deleteUser,
  updateUser,
  followUserController,
  unfollowUserController,
  getFollowersController,
  getFollowingController,
  getUserByIdController,
  isFollowingController,
} from "./users.controller";
import { isAuthenticated, isOwner } from "../../middleware";

export default (router: express.Router) => {
  router.get("/users", isAuthenticated, getAllUsers);
  router.get("/users/:id", getUserByIdController);

  router.delete("/users/:id", isAuthenticated, isOwner, deleteUser);
  // ... (existing imports)

  // Update a user route including profile picture upload
  router.put(
    "/users/:id",
    isAuthenticated,
    isOwner,

    updateUser
  );

  // ... (existing routes)
  // Follow a user
  router.post("/users/:id/follow", isAuthenticated, followUserController);

  // Unfollow a user
  router.post("/users/:id/unfollow", isAuthenticated, unfollowUserController);

  // Get Followers
  router.get("/users/:id/followers", isAuthenticated, getFollowersController);

  // Get Following
  router.get("/users/:id/following", isAuthenticated, getFollowingController);
  router.get("/users/:id/isFollowing", isAuthenticated, isFollowingController);
};
