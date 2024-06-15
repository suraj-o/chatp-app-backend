export interface UserType extends Document {
    _id?:string,
    name:string,
    password:string,
    email:string,
    username:string,
    avatar:{
        public_Id:string,
        url:string
    },
    createdAt:Date,
    updatedAt:Date
}