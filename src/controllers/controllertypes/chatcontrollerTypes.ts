import { ObjectId } from "mongoose";

export interface ChatRequestType extends Document{
    name:string,
    members:string[]
}

// export interface TransformchatType{
//     _id:string,
//     name:string,
//     groupchat:boolean,
//     avatar:string[] | string
// }

// export  interface AllListType{
//     avatar:{
//         public_id:string,
//         url:string
//     },
//     _id:string,
//     name:string,
//     groupchat:true
// }
 
