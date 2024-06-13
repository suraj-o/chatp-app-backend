import { ObjectId } from "mongoose";
import { UserType } from "../userModelTypes.js";

export interface ChatsType extends Document{
    name:string,
    groupchat:boolean,
    creator?:UserType
    members:{ _id: string; groupchat: boolean; name: string; avatar: any; }[];
}