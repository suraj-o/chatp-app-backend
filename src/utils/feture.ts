import { User } from "../models/userModel.js";
import {faker} from "@faker-js/faker"

export const emit=(req:any,event:string,users:string[],data?:string)=>{
console.log(event);
}

export const createUSers=async(num:number)=>{
    try {
        const userPromise=[];

        for(let i=0; i<num; i++){
            const tempUser= User.create({
                name:faker.person.fullName(),
                email:faker.internet.email(),
                username:faker.internet.userName(),
                password:"2020202020",
                avatar:{
                    url:faker.image.avatar(),
                    public_Id:faker.system.fileName()
                }
            })

            userPromise.push(tempUser)
        }

        await Promise.all(userPromise)
        
    } catch (error) {
        console.log("error while creating user")
    }
}