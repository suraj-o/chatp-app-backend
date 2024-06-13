import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { TryCatch } from "../middlewares/errorMiddleware.js";
import ErrorNewobject from "./customErrorObj.js";
export function connectDB(url) {
    mongoose.connect(url, { dbName: "chatapp" }).then((data) => { console.log(`connected to ${data.connection.host}`); })
        .catch((error) => console.log(error));
}
export const sendCookies = (user, res, message, status) => {
    const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET);
    const cookieOption = {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameStie: "none"
    };
    return res.cookie("_id", token, cookieOption).status(status).json({
        success: true,
        message
    });
};
export const verifyToken = (token, jwtSecret) => {
    return jwt.verify(token, jwtSecret);
};
export const isAuthenticated = TryCatch(async (req, res, next) => {
    const cookie = req.cookies["_id"];
    if (!cookie)
        return next(new ErrorNewobject("please login", 404));
    const user = jwt.verify(cookie, process.env.JWT_SECRET);
    if (!user)
        return next(new ErrorNewobject("Invalid auth Id", 404));
    next();
});
