import express from "express";
import { chatController } from "./chat.controller";

const router = express.Router();

// Route to create a new chat room
router.post("/chatroom", chatController.createChatRoom);

// Route to send a message
router.post("/message", chatController.sendMessage);

// Route to get chat history of a room
router.get("/chatroom/:chatRoomId/history", chatController.getChatHistory);

// Route to mark a message as read
router.put("/message/read", chatController.markMessageAsRead);

// Route to add a participant to a chat room
router.put("/chatroom/participant/add", chatController.addParticipant);

// Route to remove a participant from a chat room
router.put("/chatroom/participant/remove", chatController.removeParticipant);

// Route to get or create a global chat room
router.get("/chatroom/global", chatController.getOrCreateGlobalChatRoom);

export default router;
