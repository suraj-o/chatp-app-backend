import { User } from "../models/userModel.js";
import ErrorNewobject from "../utils/customErrorObj.js";
import { TryCatch } from "../middlewares/errorMiddleware.js";
import { sendCookies, verifyToken } from "../utils/database.js";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { Chats } from "../models/chats/chat.js";
import { createUSers } from "../utils/feture.js";
export const signup = TryCatch(async (req, res, next) => {
    const { name, email, username, password } = req.body;
    const avatar = req.file;
    if (!name || !email || !username || !password)
        return next(new ErrorNewobject("please fill aur require fields", 404));
    let fakeAvatar = {
        public_Id: "dskjflkasj",
        url: "dhsafkjsdals"
    };
    const isEmailExit = await User.findOne({ email });
    if (isEmailExit)
        return next(new ErrorNewobject("email already exist please login", 404));
    const isUsernameExit = await User.findOne({ username });
    if (isUsernameExit)
        return next(new ErrorNewobject("username already exist", 404));
    const user = await User.create({
        name,
        username,
        email,
        password,
        avatar: fakeAvatar
    });
    return sendCookies(user, res, "userCreated", 201);
});
export const login = TryCatch(async (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password)
        return next(new ErrorNewobject("please enter username & password", 404));
    const user = await User.findOne({ username }).select("+password");
    if (!user)
        return next(new ErrorNewobject("user does not exist create an accounat", 404));
    const isMatched = await compare(password, user.password);
    if (!isMatched)
        return next(new ErrorNewobject("incorrect password", 404));
    sendCookies(user, res, `walcome back ${user.name}`, 200);
});
export const getmyProfile = TryCatch(async (req, res, next) => {
    const { _id } = req.cookies;
    if (!_id)
        return next(new ErrorNewobject("login first", 401));
    const Id = jwt.verify(_id, process.env.JWT_SECRET);
    const user = await User.findById(Id);
    if (!user)
        return next(new ErrorNewobject("Invalid auth Id", 404));
    res.status(200).json({
        success: true,
        user
    });
});
export const logout = TryCatch(async (req, res, next) => {
    if (!req.cookies["_id"])
        return next(new ErrorNewobject("already logged out", 404));
    res.status(200).cookie("_id", "", {
        maxAge: 0,
        sameSite: "none",
        httpOnly: true,
        secure: true
    })
        .json({
        success: true,
        message: "logged out"
    });
});
export const search = TryCatch(async (req, res, next) => {
    const { name } = req.query;
    const id = verifyToken(req.cookies["_id"], process.env.JWT_SECRET);
    const chats = await Chats.find({ members: id, groupchat: false });
    const allFriends = chats.flatMap((chat) => chat.members);
    const allExcludeMembers = await User.find({ _id: { $nin: allFriends }, name: {
            $regex: name?.toString(),
            $options: "i"
        } });
    createUSers(12);
    res.json({ sucess: true, allExcludeMembers });
    // const chatsIcludesMe=user
});
