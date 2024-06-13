import mongoose, { Schema } from "mongoose";
import { MessagesType } from "../types/chats/messageTypes.js";

const schema = new Schema(
    {
        sender:{
            type:mongoose.Types.ObjectId,
            ref:"User"
        },
        chat:{
            type:mongoose.Types.ObjectId,
            ref:"Chats"
        },
        content:String,
        attachment:[
            {
                public_Id:{
                    type:String,
                    required:true
                },
                url:{
                    type:String,
                    required:true
                }
            }
        ]
    },
    {
        timestamps:true
    }
);

const Messages = mongoose.model<MessagesType>("Messages",schema)

