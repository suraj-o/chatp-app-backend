import { ALERT, FETCH_DATA } from "../constants/chatsEvents.js";
import { otherUser } from "../lib/helper.js";
import { TryCatch } from "../middlewares/errorMiddleware.js";
import { Chats } from "../models/chats/chat.js";
import { User } from "../models/userModel.js";
import ErrorNewobject from "../utils/customErrorObj.js";
import { verifyToken } from "../utils/database.js";
import { emit } from "../utils/feture.js";
export const newgroupChat = TryCatch(async (req, res, next) => {
    const { name, members } = req.body;
    if (members.length > 3)
        return next(new ErrorNewobject("grouchat must have atleast 3 member ", 400));
    const id = verifyToken(req.cookies["_id"], process.env.JWT_SECRET);
    const allMembers = [...members, id];
    await Chats.create({
        name,
        members: allMembers,
        creator: id,
        groupchat: true
    });
    emit(req, ALERT, allMembers, `welcome to ${name} group chat`);
    emit(req, FETCH_DATA, members);
    res.status(201).json({
        success: true,
        messsage: "group created successfully"
    });
});
export const myChats = TryCatch(async (req, res, next) => {
    const id = verifyToken(req.cookies["_id"], process.env.JWT_SECRET);
    const chats = await Chats.find({ members: id }).populate("members", "avatar username");
    const transformedChats = chats.map(({ _id, groupchat, name, members }) => {
        const getotherUser = otherUser(members, id);
        return {
            _id,
            groupchat,
            name: groupchat ? name : otherUser.name,
            avatar: groupchat ? members.slice(0, 3).map(({ avatar }) => avatar.url)
                : [getotherUser.avatar.url],
            members: members.reduce((prev, curr) => {
                if (curr._id.toString() !== id.toString()) {
                    prev.push(curr._id);
                }
                return prev;
            }, [])
        };
    });
    res.status(200).json({
        sucess: true,
        chats: transformedChats
    });
});
export const myGroups = TryCatch(async (req, res, next) => {
    const id = verifyToken(req.cookies["_id"], process.env.JWT_SECRET);
    const chat = await Chats.find({
        creator: id,
        groupchat: true,
        members: id
    }).populate("members", "avatar name");
    console.log(chat);
    const groupchat = chat.map(({ members, _id, name, groupchat }) => {
        return {
            _id,
            groupchat,
            name,
            avatar: members.slice(0, 3).map((i) => i.avatar.url)
        };
    });
    res.status(200).json({
        success: true,
        groupchat
    });
});
//  uncompleted yet or not working 
export const addMembers = TryCatch(async (req, res, next) => {
    const { chatId, members } = req.body;
    const id = verifyToken(req.cookies["_id"], process.env.JWT_SECRET);
    console.log(id);
    const chat = await Chats.findById(chatId);
    if (!chat)
        return next(new ErrorNewobject("Invalid group or group not found ", 404));
    if (!chat.groupchat)
        return next(new ErrorNewobject("this not group ", 400));
    // if(chat.creator !== id )return next(new ErrorNewobject("you have no any permisson to add member",400));
    const addAllMemberPromise = members.map((i) => User.findById(i));
    const allmemebrList = await Promise.all(addAllMemberPromise);
    const memberIds = allmemebrList.map((i) => ({
        _id: i?._id.toString(),
        name: i?.name,
        groupchat: true,
        avatar: {
            public_id: i?.avatar.public_Id,
            url: i?.avatar.url
        }
    }));
    chat.members.push(...memberIds);
    await chat.save();
    emit(req, ALERT, chat.members, "users added");
    emit(req, FETCH_DATA, chat.members);
    res.json({
        sucess: true,
        allmemebrList
    });
});
