import mongoose, { Schema } from "mongoose";
import { ChatsType } from "../types/chats/chatsTyps.js";

const schema = new Schema(
    {
        name:{
            type:String,
            required:[true,"please provide your name"]
        },
        groupchat:{
            type:Boolean,
            default:false
        },
        creator:{
            type:mongoose.Types.ObjectId,
            ref:"User"
        },
        members:[
            {
                type:mongoose.Types.ObjectId,
                ref:"User"
            }
        ]
    },
    {
        timestamps:true
    }
);

export const Chats = mongoose.model<ChatsType>("Chats",schema)

