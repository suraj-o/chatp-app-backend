import mongoose, { Schema } from "mongoose";
import validator from "validator";
import { UserType } from "./types/userModelTypes.js";
import {hash} from "bcrypt"

const schema = new Schema(
    {
        name:{
            type:String,
            required:[true,"please provide your name"]
        },
        username:{
            type:String,
            required:[true,"please provide your username"],
        },
        email:{
            type:String,
            unique:true,
            required:[true,"please provide your email"],
            validate:validator.default.isEmail
        },
        password:{
            type:String,
            required:[true,"please set your password"],
            select:false
        },
        avatar:{
            public_Id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
        }
    },
    {
        timestamps:true
    }
);

schema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
     
   //hasing passwords
   this.password=await hash(this.password,10)
})

export const User = mongoose.model<UserType>("User",schema)

