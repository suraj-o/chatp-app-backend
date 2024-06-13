import { UserType } from "../models/types/userModelTypes.js"

type Membertypes={
    _id:string,
    name:string,
    avatar:{
        public_Id:string,
        url:string
    }
}

export const otherUser=(member:Membertypes[],userId:string)=>(
    member.find((member)=>member._id.toString() !== userId)
)