import express from "express";
import {
  createGroupController,
  getGroupByIdController,
  updateGroupByIdController,
  deleteGroupByIdController,
} from "./group.controller";
import { isAuthenticated } from "../../../middleware";

export default (router: express.Router) => {
  // Route to create a new group
  router.post("/groups", isAuthenticated, createGroupController);

  // Route to get a group by its ID
  router.get("/groups/:id", isAuthenticated, getGroupByIdController);

  // Route to update a group by its ID
  router.put("/groups/:id", isAuthenticated, updateGroupByIdController);

  // Route to delete a group by its ID
  router.delete("/groups/:id", isAuthenticated, deleteGroupByIdController);
};
