export interface SignupRequetType{
    name:string,
    email:string,
    username:string,
    password:string
    avatar:File
}

export interface OptionTypes{
    maxAge: number;
    sameSite: string;
    httpOnly: boolean;
    secure: boolean;
}