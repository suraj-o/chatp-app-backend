import express, { NextFunction, Request, Response, urlencoded } from "express";
import { errorMiddlewere } from "./middlewares/errorMiddleware.js";
import userRoute from "./routes/user.js";
import { connectDB } from "./utils/database.js";
import { config } from "dotenv";
import morgan from "morgan"
import cookieparser from "cookie-parser"
import chatRoute from "./routes/chat.js";

// intializing express server 

const app =express();

config({
    path:"./.env"
})

connectDB(process.env.URL_DB as string)

// welcome route 
app.get("/",(req:Request,res:Response,next:NextFunction)=>{
    res.status(201).json({
        success:true,
        message:"hey there" 
    })
})

// middlewares
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieparser())

app.use('/api/v1/user/',userRoute);
app.use('/api/v1/chat/',chatRoute);

//handling global errors and custom errors  
app.use(errorMiddlewere);

// defining port of server
app.listen(9000,()=>{console.log("server working on port 8000")})

