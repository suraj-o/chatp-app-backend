import express from "express";
import { getmyProfile, login, logout, signup } from "../controllers/userController.js";
import singleUpload from "../middlewares/multer.js";
import { isAuthenticated } from "../utils/database.js";

const user= express.Router();

user.post("/signup",singleUpload,signup);
user.post("/login",login);
user.get("/profile",isAuthenticated,getmyProfile);
user.get("/logout",logout);


export default user;