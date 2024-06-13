import { Response } from "express";
import { UserType } from "../../models/types/userModelTypes.js";

export interface SendcookieType{
    user:UserType,
    res:Response,
    message:string,
    status:number
}