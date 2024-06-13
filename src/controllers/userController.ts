import { NextFunction, Request, Response } from "express";
import { User } from "../models/userModel.js";
import ErrorNewobject from "../utils/customErrorObj.js";
import { TryCatch } from "../middlewares/errorMiddleware.js";
import { OptionTypes, SignupRequetType } from "./controllertypes/usercontrollerType.js";
import { sendCookies } from "../utils/database.js";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken"

export const signup=TryCatch(async(
    req:Request<{},{},SignupRequetType>,
    res:Response,
    next:NextFunction)=>{
        const {name,email,username,password}=req.body;
        const avatar= req.file

        if(!name || !email || !username || !password) return next(new ErrorNewobject("please fill aur require fields",404))
        
        let fakeAvatar={
            public_Id:"dskjflkasj",
            url:"dhsafkjsdals"
        }
    
        const isEmailExit = await User.findOne({email});
        if(isEmailExit) return next(new ErrorNewobject("email already exist please login",404))

        const isUsernameExit=await User.findOne({username});
        if(isUsernameExit) return next(new ErrorNewobject("username already exist",404))

        const user =await User.create({
            name,
            username,
            email,
            password,
            avatar:fakeAvatar
        })

      return sendCookies(user,res,"userCreated",201)

})

export const login=TryCatch(async(
    req:Request<{},{},{username:string,password:string}>,
    res:Response,next:NextFunction)=>{
    
        const {username,password}=req.body;
        if(!username || !password) return next(new ErrorNewobject("please enter username & password",404));

        const user =await User.findOne({username}).select("+password");
        if(!user) return next(new ErrorNewobject("user does not exist create an accounat",404));

        const isMatched= await compare(password,user.password);
        if(!isMatched) return next(new ErrorNewobject("incorrect password",404));
        
        sendCookies(user,res,`walcome back ${user.name}`,200);    
})

export const getmyProfile=TryCatch(async(req:Request,res:Response,next:NextFunction)=>{
    const {_id}= req.cookies;
    if(!_id) return next(new ErrorNewobject("login first",401));

    const Id=jwt.verify(_id,process.env.JWT_SECRET as string);
    const user= await User.findById(Id);
    if(!user) return next(new ErrorNewobject("Invalid auth Id",404));

    
    res.status(200).json({
        success:true,
        user
    })
})

export const logout=TryCatch(async(req:Request,res:Response,next:NextFunction)=>{
    if(!req.cookies["_id"])return next(new ErrorNewobject("already logged out",404));
  
    res.status(200).cookie("_id","",{
        maxAge:0,
        sameSite:"none",
        httpOnly:true,
        secure:true})
                    .json({
                            success:true,
                            message:"logged out"
                        })
})