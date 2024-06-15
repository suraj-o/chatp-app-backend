import { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { TryCatch } from "../middlewares/errorMiddleware.js";
import { Chats } from "../models/chats/chat.js";
import { User } from "../models/userModel.js";
import ErrorNewobject from "../utils/customErrorObj.js";
import { sendCookies, verifyToken } from "../utils/database.js";
import { fRequest } from "../models/chats/request.js";
import { emit } from "../utils/feture.js";
import { FETCH_DATA } from "../constants/chatsEvents.js";
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
    res.status(200).json({
        sucess: true,
        allExcludeMembers
    });
});
export const sendRequest = TryCatch(async (req, res, next) => {
    const { reciver } = req.body;
    const id = verifyToken(req.cookies["_id"], process.env.JWT_SECRET);
    const sentRequsetCheck = await fRequest.findOne({
        $or: [
            { sender: id, reciver },
            { sender: reciver, reciver: id }
        ]
    });
    if (sentRequsetCheck)
        return next(new ErrorNewobject("request already sent", 400));
    const request = await fRequest.create({
        sender: id,
        reciver,
    });
    res.status(200).json({
        success: true,
        request
    });
});
export const acceptRequest = TryCatch(async (req, res, next) => {
    const { requestId, accept } = req.body;
    const me = verifyToken(req.cookies["_id"], process.env.JWT_SECRET);
    const requestD = await fRequest.findOne({ _id: requestId }).populate("sender", "name").populate("reciver", "name");
    if (!requestD)
        return next(new ErrorNewobject("Invalid request id", 404));
    if (requestD.reciver._id?.toString() !== me._id) {
        return next(new ErrorNewobject("you have not permisson to accecpt this request", 400));
    }
    if (!accept) {
        await requestD.deleteOne();
        return res.status(200).json({
            success: true,
            message: "request rejected"
        });
    }
    let members = [requestD.reciver, me];
    await Promise.all([
        Chats.create({
            name: `${requestD.sender.name}-${requestD.reciver.name}`,
            creaotr: requestD.sender,
            members: [
                requestD.sender,
                requestD.reciver
            ]
        }), requestD.deleteOne()
    ]);
    emit(req, FETCH_DATA, members);
    res.status(200).json({
        success: true,
        message: "now you have connected with this user",
    });
});
export const getAllnotification = TryCatch(async (req, res, next) => {
    const id = verifyToken(req.cookies["_id"], process.env.JWT_SECRET);
    const pendingRequest = await fRequest.find({ reciver: id }).populate("sender", "name avatar");
    if (!pendingRequest)
        return next(new ErrorNewobject("no request found", 404));
    const transFormedRequest = pendingRequest.map((request) => {
        return {
            _id: request._id,
            senderId: request.sender._id,
            name: request.sender.name,
            avatar: request.sender.avatar.url
        };
    });
    res.status(200).json({
        sucess: true,
        requests: transFormedRequest
    });
});
