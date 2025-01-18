// controllers/chatController.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const chatController = {
  sendMessage: async (req, res) => {
    try {
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({
          success: false,
          error: "Message is required",
        });
      }

      // Initialize the model
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      // Send the message directly with the context
      const prompt = `You are a friendly movie recommendation chatbot. Please help with the following request: ${message}. 
            When recommending movies:
            1. Consider the user's stated preferences and mood
            2. Mention the genre and a brief plot summary
            3. Explain why you're recommending each movie
            4. Include the release year and key cast members
            5. Keep responses concise but informative`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const botResponse = response.text();

      res.json({
        success: true,
        message: botResponse,
      });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to process chat request",
      });
    }
  },
};

export default chatController;
