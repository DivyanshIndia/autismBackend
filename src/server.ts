import { Server } from "socket.io";
import http from "http";
import {
  createConversation,
  updateConversationById,
} from "./models/chat/conversation/conversation.model";
import { createMessage } from "models/chat/message/message.model";
import Conversation from "models/chat/conversation/conversation.model";

const userSocketMap = new Map();

export const initializeSocket = (server: http.Server) => {
  const io = new Server(server, {
    cors: { origin: "*", credentials: true },
  });

  // Define Socket.io event listeners
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Listen for new messages
    socket.on("newMessage", async ({ senderId, receiverId, content }) => {
      try {
        let conversationId;

        // Check if conversation already exists
        const existingConversation = await Conversation.findOne({
          participants: { $all: [senderId, receiverId] },
        });

        if (existingConversation) {
          conversationId = existingConversation._id;
        } else {
          // Create a new conversation if it doesn't exist
          const newConversation = await createConversation({
            participants: [senderId, receiverId],
          });
          conversationId = newConversation._id;

          // Emit conversation ID to both users
          io.to(userSocketMap.get(senderId)).emit(
            "conversationId",
            conversationId
          );
          io.to(userSocketMap.get(receiverId)).emit(
            "conversationId",
            conversationId
          );
        }

        // Create new message
        const newMessage = await createMessage({
          sender_id: senderId,
          recipient_id: receiverId,
          content: content,
        });

        // Update conversation with new message ID
        await updateConversationById(conversationId, {
          $push: { messages: newMessage._id },
        });

        // Emit message to receiver
        io.to(userSocketMap.get(receiverId)).emit("message", newMessage);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });

    socket.on("newGroupMessage", async ({ groupId, senderId, content }) => {
      try {
        const newMessage = await createMessage({
          sender_id: senderId,
          recipient_id: groupId,
          content: content,
        });
 // Broadcast the group message to all members of the group
 socket.to(groupId).emit("groupMessage", newMessage);      } catch (error) {
        console.error("Error sending message:", error);
      }
    });

    // Associate user ID with socket ID
    socket.on("setUserId", (userId) => {
      userSocketMap.set(userId, socket.id);
    });

     // Join a group
     socket.on("joinGroup", (groupId) => {
        socket.join(groupId); // Join the room associated with the group ID
      });

    // Handle disconnect event
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);

      // Remove user ID from mapping
      for (const [key, value] of userSocketMap.entries()) {
        if (value === socket.id) {
          userSocketMap.delete(key);
          break;
        }
      }
    });

    // Handle reconnect event
    socket.on("reconnect", () => {
      console.log(`User reconnected: ${socket.id}`);

      // Update user ID mapping with new socket ID
      for (const [key, value] of userSocketMap.entries()) {
        if (value === socket.id) {
          userSocketMap.set(key, socket.id);
          break;
        }
      }
    });
  });
  return io;
};
