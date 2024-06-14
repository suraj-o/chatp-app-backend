import { UserType } from "../userModelTypes.js";

export interface ChatsType extends Document{
    name:string,
    groupchat:boolean,
    creator?:UserType
    members:{ _id: string; name: string; avatar: any; }[];
}