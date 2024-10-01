import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
import contactsRoutes from "./routes/ContactRoutes.js";
import setupSocket from "./socket.js";
import messagesRoutes from "./routes/MessagesRoutes.js";
import channelRoutes from "./routes/ChannelRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const databaseURL = process.env.DATABASE_URL;
const allowedOrigins = ['https://chat-app-client-tau-nine.vercel.app', 'https://chat-app-client-tau-nine.vercel.app:5173','https://chat-app-client-tau-nine.vercel.app/','*','https://chat-app-client-tau-nine.vercel.app/auth','https://chat-app-client-tau-nine.vercel.app/profile','https://chat-app-client-tau-nine.vercel.app/chat'];

app.use(
  cors({
   origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/channel", channelRoutes);

const server = app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

setupSocket(server);

mongoose
  .connect("mongodb+srv://shivanshkaushik1237:iCaKXM4Oj4SKpRq9@syncronus-chat-app.ndoj5.mongodb.net/?retryWrites=true&w=majority&appName=syncronus-chat-app")
  .then(() => console.log("DB connection Succesful."))
  .catch((err) => console.log(err.message));
