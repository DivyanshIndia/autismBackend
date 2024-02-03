import { Request, Response } from "express";
import ChatRoom, { IChatRoom } from "./chatRoom/chatRoom.model";
import Message, { IMessage } from "./message/message.model";

class ChatController {
  // Create a new chat room
  async createChatRoom(req: Request, res: Response): Promise<void> {
    try {
      const { type, participants } = req.body;
      const chatRoom = new ChatRoom({ type, participants });
      await chatRoom.save();
      res.status(201).json(chatRoom);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Send a message
  async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const { senderId, chatRoomId, content } = req.body;
      const message = new Message({
        sender: senderId,
        chatRoom: chatRoomId,
        content,
      });
      await message.save();
      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Get chat history
  async getChatHistory(req: Request, res: Response): Promise<void> {
    try {
      const { chatRoomId } = req.params;
      const messages = await Message.find({ chatRoom: chatRoomId }).populate(
        "sender",
        "username"
      );
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Mark Message as Read
  async markMessageAsRead(req: Request, res: Response): Promise<void> {
    try {
      const { messageId, userId } = req.body;
      const message = await Message.findByIdAndUpdate(
        messageId,
        { $addToSet: { readBy: userId } },
        { new: true }
      );
      res.status(200).json(message);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Add Participant to Chat Room
  async addParticipant(req: Request, res: Response): Promise<void> {
    try {
      const { chatRoomId, newParticipantId } = req.body;
      const chatRoom = await ChatRoom.findByIdAndUpdate(
        chatRoomId,
        { $addToSet: { participants: newParticipantId } },
        { new: true }
      );
      res.status(200).json(chatRoom);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Remove Participant from Chat Room
  async removeParticipant(req: Request, res: Response): Promise<void> {
    try {
      const { chatRoomId, participantId } = req.body;
      const chatRoom = await ChatRoom.findByIdAndUpdate(
        chatRoomId,
        { $pull: { participants: participantId } },
        { new: true }
      );
      res.status(200).json(chatRoom);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Get or Create Global Chat Room
  async getOrCreateGlobalChatRoom(req: Request, res: Response): Promise<void> {
    try {
      let globalChatRoom = await ChatRoom.findOne({ type: "global" });
      if (!globalChatRoom) {
        globalChatRoom = new ChatRoom({ type: "global", participants: [] });
        await globalChatRoom.save();
      }
      res.status(200).json(globalChatRoom);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Additional methods can be implemented as needed
}

export const chatController = new ChatController();
