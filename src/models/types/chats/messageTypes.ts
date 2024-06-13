import { UserType } from "../userModelTypes.js";
import { ChatsType } from "./chatsTyps.js";

export interface MessagesType extends Document{
    sender:UserType,
    chat:ChatsType,
    content:string,
    attachment:{
        public_Id:string,
        url:string}[],
}