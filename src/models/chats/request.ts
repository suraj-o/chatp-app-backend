import mongoose, { Schema } from "mongoose";
import { RequestType } from "../types/chats/request.js";

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

export const fRequest = mongoose.model<RequestType>("Request",schema)

