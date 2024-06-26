import express from "express";
import { addMembers, getChatdetails, myChats, myGroups, newgroupChat, sendAttachment } from "../controllers/chatController.js";
import { isAuthenticated } from "../utils/database.js";
import singleUpload from "../middlewares/multer.js";
const chat = express.Router();
chat.post("/newgroup", isAuthenticated, newgroupChat);
chat.get("/my/chats", isAuthenticated, myChats);
chat.get("/my/group", isAuthenticated, myGroups);
chat.put("/my/group/addmember", isAuthenticated, addMembers);
chat.post("/new/message", isAuthenticated, singleUpload.array("files"), sendAttachment);
chat.route("/:id").get(getChatdetails);
export default chat;
