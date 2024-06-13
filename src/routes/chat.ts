import express from "express";
import { addMembers, myChats, myGroups, newgroupChat } from "../controllers/chatController.js";
import { isAuthenticated } from "../utils/database.js";

const chat=express.Router();

chat.post("/newgroup",isAuthenticated,newgroupChat);
chat.get("/my/chats",isAuthenticated,myChats);
chat.get("/my/group",isAuthenticated,myGroups);
chat.put("/my/group/addmember",isAuthenticated,addMembers);

export default chat