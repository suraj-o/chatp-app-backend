export interface UserType extends Document {
    id?:string,
    name:string,
    password:string,
    email:string,
    username:string,
    avtar:{
        public_Id:string,
        url:string
    },
    createdAt:Date,
    updatedAt:Date
}