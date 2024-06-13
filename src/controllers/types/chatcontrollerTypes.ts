import { JwtPayload } from "jsonwebtoken";

export interface ChatRequestType extends Document{
    name:string,
    members:string[]
}

export interface TransformchatType{
    _id:string,
    name:string,
    groupchat:boolean,
    avatar:string[] | string
}

