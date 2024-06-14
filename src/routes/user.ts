import express from "express";
import { getmyProfile, login, logout, search, signup } from "../controllers/userController.js";
import singleUpload from "../middlewares/multer.js";
import { isAuthenticated } from "../utils/database.js";

const user= express.Router();

user.post("/signup",singleUpload.single("avatar"),signup);
user.post("/login",login);
user.get("/profile",isAuthenticated,getmyProfile);
user.get("/logout",isAuthenticated,logout);
user.get("/search",isAuthenticated,search);


export default user;