import { NextFunction, Request, Response } from "express";
import { ALERT, FETCH_DATA } from "../constants/chatsEvents.js";
import { TryCatch } from "../middlewares/errorMiddleware.js";
import { Chats } from "../models/chats/chat.js";
import ErrorNewobject from "../utils/customErrorObj.js";
import { verifyToken } from "../utils/database.js";
import { createUSers, emit } from "../utils/feture.js";
import { ChatRequestType, TransformchatType } from "./types/chatcontrollerTypes.js";
import { otherUser } from "../lib/helper.js";


export const newgroupChat=TryCatch(async(req:Request<{},{},ChatRequestType>
    ,res:Response,next:NextFunction)=>{
     const {name,members}=req.body;

    if(members.length>3) return next(new ErrorNewobject("grouchat must have atleast 3 member ",400));
    const id=verifyToken(req.cookies["_id"],process.env.JWT_SECRET as string);

    const allMembers:string[]=[...members,id as string];

    await Chats.create({
        name,
        members:allMembers,
        creator:id,
        groupchat:true
    });

    emit(req,ALERT,allMembers,`welcome to ${name} group chat`);
    emit(req,FETCH_DATA,members);

    res.status(201).json({
        success:true,
        messsage:"group created successfully"
    });
});

export const myChats=TryCatch(async(req:Request,res:Response,next:NextFunction)=>{
    const id=verifyToken(req.cookies["_id"],process.env.JWT_SECRET as string);

    const chats = await Chats.find({members:id}).populate("members","avatar username");
        
        const transformedChats=chats.map(({_id,groupchat,name,members})=>{
        const getotherUser=otherUser(members,id as string)!;

            return {
                     _id,
                     groupchat,
                     name:groupchat?name:otherUser.name,
                     avatar:groupchat?members.slice(0,3).map(({avatar}):string=>avatar.url)
                     :[getotherUser.avatar.url as string],
                     members:members.reduce((prev,curr)=>{
                        if(curr._id.toString() !== id.toString()){
                            prev.push(curr._id as never)
                        }
                        return prev
                     },[])
                    }
    });

    res.status(200).json({
        sucess:true,
        chats:transformedChats
    })
})

export const myGroups=TryCatch(async(req:Request,res:Response,next:NextFunction)=>{
    const id=verifyToken(req.cookies["_id"],process.env.JWT_SECRET as string);

    const chat = await Chats.find({
        creator:id as string,
        groupchat:true,
        members:id as string
    }).populate("members","avatar name ")

    const groupchat=chat.map(({members,_id,name,groupchat})=>{
        return {
            _id,
            groupchat,
            name,
            avatar:members.slice(0,3).map(({avatar})=>avatar.url)
        }
    })

    res.status(200).json({
        success:true,
        groupchat
    })
})