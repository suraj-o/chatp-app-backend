import { UserType } from "../userModelTypes.js";

export interface RequestType extends Document{
    sender:UserType,
    reciver:UserType,
    status:"pending"|"accepted"|"rejected"
}