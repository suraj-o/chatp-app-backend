import { NextFunction, Request, Response } from "express";
import ErrorNewobject from "../utils/customErrorObj.js";
import { tryCatchFunc } from "./types/errorMiddlewareTypes.js";

const errorMiddlewere=(
    err:ErrorNewobject,
    req:Request,
    res:Response,
    next:NextFunction
    ) => {
        
    err.message||="internal server error";
    err.status||=500;
    
    return res.status(err.status).json({
        succes:false,
        message:err.message
    })
}

 const TryCatch =(func:tryCatchFunc)=>(req:Request,res:Response,next:NextFunction)=>{
    Promise.resolve(func(req,res,next)).catch(next)
}

export {errorMiddlewere,TryCatch}