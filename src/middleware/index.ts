import express from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { merge, get } from "lodash";

// Assuming getUserById is a function that fetches user data from the database
import { getUserById } from "../models/user/user.model";
import { getPostById } from "../models/post/post.model";

const JWT_SECRET = process.env.JWT_SECRET || "himeshRashmiya"; // Your secret key for JWT

export const isAuthenticated = async (
  req: express.Request & { identity?: any },
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(403)
        .json({ message: "No authorization token provided." });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    const existingUser = await getUserById(decoded.id);

    if (!existingUser) {
      return res.status(403).json({ message: "Invalid token." });
    }

    // Use 'merge' to add the user information to the request object
    merge(req, { identity: existingUser });
    return next();
  } catch (error) {
    console.error("Authentication error:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid Token" });
    }
    return res
      .status(500)
      .json({ message: "An error occurred during authentication." });
  }
};

export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, "identity._id") as string; // Extracted from JWT in isAuthenticated

    // Check if the user identity is available in the request
    if (!currentUserId) {
      return res
        .status(401)
        .json({ message: "Unauthorized access. User identity is missing." });
    }

    // Fetch the resource from the database and compare owner ID
    const resource = await getUserById(id);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found." });
    }

    // Check if the current user is the owner of the resource
    if (resource.id.toString() !== currentUserId.toString()) {
      return res.status(403).json({
        message:
          "Forbidden. You do not have permission to access this resource.",
      });
    }

    next();
  } catch (error) {
    console.error("Error in isOwner middleware:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const isPostOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const postId = req.params.id;
    const userId = get(req, "identity._id") as string;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized access. User identity is missing." });
    }

    // Fetch the post from the database
    const post = await getPostById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    // Check if the current user is the owner of the post
    if (post.author.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Forbidden. You do not have permission to edit this post.",
      });
    }

    next();
  } catch (error) {
    console.error("Error in isPostOwner middleware:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
