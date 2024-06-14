import { NextFunction, Request, Response } from "express";
import { ALERT, FETCH_DATA, NEW_ATTACHMENT, NEW_MESSAGE_ALERT } from "../constants/chatsEvents.js";
import { otherUser } from "../lib/helper.js";
import { TryCatch } from "../middlewares/errorMiddleware.js";
import { Chats } from "../models/chats/chat.js";
import { User } from "../models/userModel.js";
import ErrorNewobject from "../utils/customErrorObj.js";
import { verifyToken } from "../utils/database.js";
import { emit } from "../utils/feture.js";
import { ChatRequestType } from "./controllertypes/chatcontrollerTypes.js";
import { Messages } from "../models/chats/messages.js";


export const newgroupChat=TryCatch(async(req:Request<{},{},ChatRequestType>
    ,res:Response,next:NextFunction)=>{
        const {name,members}=req.body;

    let groupchat:boolean=false;

    if(members.length>2) groupchat=true;

    const id=verifyToken(req.cookies["_id"],process.env.JWT_SECRET as string);

    const allMembers:string[]=[...members,id as string];

    await Chats.create({
        name,
        members:allMembers,
        creator:id,
        groupchat
    });

   emit(req,ALERT,allMembers,groupchat?`welcome to ${name} group chat`:`you are connected`);
    emit(req,FETCH_DATA,members);

    res.status(201).json({
        success:true,
        messsage:groupchat?"group created successfully":"now you were connected"
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
    }).populate("members","avatar name")



    const groupchat=chat.map(({members,_id,name,groupchat})=>{
        return {
            _id,
            groupchat,
            name,
            avatar:members.slice(0,3).map((i)=>i.avatar.url)
        }
    })

    res.status(200).json({
        success:true,
        groupchat
    })
})

 
export const addMembers=TryCatch(async(req:Request<{},{},{chatId:string,members:string[]}>
    ,res:Response,next:NextFunction)=>{
        const {chatId,members}= req.body;
        const id=verifyToken(req.cookies["_id"],process.env.JWT_SECRET as string);

        const chat=await Chats.findById(chatId)!;

            if(!chat) return next(new ErrorNewobject("Invalid group or group not found ",404));
            if(!chat.groupchat) return next(new ErrorNewobject("this not group ",400));
            if(chat.creator !== id )return next(new ErrorNewobject("you have no any permisson to add member",400));

        const addAllMemberPromise= members.map((i)=>User.findById(i));
        const allmemebrList= await Promise.all(addAllMemberPromise)!;

            const memberIds= allmemebrList.map((i)=>({
                _id:i?._id.toString()!,
                name:i?.name!,
                avatar:{
                    public_id:i?.avatar.public_Id!,
                    url:i?.avatar.url!
                }
            }));
        

            chat.members.push(...memberIds)

            await chat.save();

        emit(req,ALERT,chat.members,"users added");
        emit(req,FETCH_DATA,chat.members);

        res.json({
            sucess:true,
            allmemebrList
        })
    })
    
    
export const sendAttachment=TryCatch(async(req:Request,res:Response,next:NextFunction)=>{
    const {chatId}= req.body;
    const myId= verifyToken(req.cookies["_id"],process.env.JWT_SECRET as string);

    const [chat,me]= await Promise.all([Chats.findById(chatId),User.findById(myId,"name")]);
          if(!chat) return next(new ErrorNewobject("chat not found",404));

    const files=req.files || [];
    
    // cloudnary upload
    const attchMents:[]=[]

    const messageForRealTime={
        content:"",
        attchMents,
        sender:{
            _id:me?._id,
            name:me?.name
        },
        chatId
    }
    const messageForDb={
        content:"",
        attchMents,
        sender:me?._id,
        chat:chat._id
    }

    const message=await Messages.create(messageForDb);

        emit(req,NEW_ATTACHMENT,chat.members,{
            message:messageForRealTime,
            chatId
        });
    
        emit(req,NEW_MESSAGE_ALERT,chat.members,{chatId,sender:me?._id})

    res.status(200).json({
        success:true,
        message,   
    })
})

export const getChatdetails=TryCatch(async(req:Request,res:Response,next:NextFunction)=>{
    if(req.query.populate === "true"){
        const chat=await Chats.findById(req.params.id).populate("members","name avatar").lean();
             if(!chat){
            return next(new ErrorNewobject("chat not found",404))
        }else{
            chat.members= chat.members.map((i)=>(
                {
                    _id:i._id,
                    name:i.name,
                    avatar:i.avatar.url
                }
            ))
            console.log(chat)
            return res.status(200).json({
                chat
             })
        }   
    }
    else{
       const chat=await Chats.findById(req.params.id);
       if(!chat){
         return next(new ErrorNewobject("chat not found",404))
        }
       else{
        return res.status(200).json({
            suceess:true,
            chat
          })
       }       
    }
})

