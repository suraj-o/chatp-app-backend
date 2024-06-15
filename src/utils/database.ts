import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { TryCatch } from "../middlewares/errorMiddleware.js";
import { UserType } from "../models/types/userModelTypes.js";
import ErrorNewobject from "./customErrorObj.js";


export function connectDB(url:string){
    mongoose.connect(url,{dbName:"chatapp"}).then((data)=>{console.log(`connected to ${data.connection.host}`)})
                                            .catch((error)=>console.log(error))
}

export const sendCookies=(user:UserType,res:Response,message:string,status:number):Response=>{
    const token =jwt.sign({_id:user._id},process.env.JWT_SECRET!)

    const cookieOption={
        maxAge:24 * 60 * 60 * 1000,
        httpOnly:true,
        secure:true,
        sameStie:"none"
    }

    return res.cookie("_id",token,cookieOption).status(status).json({
        success:true,
        message
    })
}

export const verifyToken=(token:string,jwtSecret:string)=>{
    return jwt.verify(token,jwtSecret);
}

export const isAuthenticated=TryCatch(async(req:Request,res:Response,next:NextFunction)=>{
    const cookie = req.cookies["_id"];
    if(!cookie) return next(new ErrorNewobject("please login",404));

    const user =jwt.verify(cookie,process.env.JWT_SECRET as string);
    if(!user) return next(new ErrorNewobject("Invalid auth Id",404));

    next()
})
