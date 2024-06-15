import express from "express";
import { acceptRequest, getAllnotification, getmyProfile, login, logout, search, sendRequest, signup } from "../controllers/userController.js";
import singleUpload from "../middlewares/multer.js";
import { isAuthenticated } from "../utils/database.js";

const user= express.Router();

user.post("/signup",singleUpload.single("avatar"),signup);
user.post("/login",login);
user.get("/profile",isAuthenticated,getmyProfile);
user.get("/logout",isAuthenticated,logout);
user.get("/search",isAuthenticated,search);
user.post("/request",isAuthenticated,sendRequest);
user.post("/request",isAuthenticated,sendRequest);
user.get("/notifications",isAuthenticated,getAllnotification);
user.put("/request/response",isAuthenticated,acceptRequest);


export default user;