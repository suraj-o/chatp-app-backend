import express, { NextFunction, Request, Response, urlencoded } from "express";
import { errorMiddlewere } from "./middlewares/errorMiddleware.js";
import userRoute from "./routes/user.js";
import { connectDB } from "./utils/database.js";
import { config } from "dotenv";
import morgan from "morgan"
import cookieparser from "cookie-parser"
import chatRoute from "./routes/chat.js";
import {createServer} from "http"
import { Server, Socket } from "socket.io";

// intializing express server 

const app =express();
const server=createServer(app);
const io=new Server(server,{})

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

io.on("connection",(soket)=>{
    console.log(soket.id)

    soket.on("NEW_MESSAGE",(data)=>{
        console.log(data)
    })
})

//handling global errors and custom errors  
app.use(errorMiddlewere);

// defining port of server
server.listen(9000,()=>{console.log("server working on port 9000")})

