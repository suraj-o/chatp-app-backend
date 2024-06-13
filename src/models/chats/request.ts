import mongoose, { Schema } from "mongoose";
import { MessagesType } from "../types/chats/messageTypes.js";

const schema = new Schema(
    {
        sender:{
            type:mongoose.Types.ObjectId,
            ref:"User"
        },
        reciver:{
            type:mongoose.Types.ObjectId,
            ref:"User"
        },
        status:{
            type:String,
            default:"pending",
            enum:["pending","accepted","rejected"]
        }
    },
    {
        timestamps:true
    }
);

const Messages = mongoose.model<MessagesType>("Messages",schema)

