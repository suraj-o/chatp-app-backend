import multer, { memoryStorage } from "multer";
const singleUpload = multer({
    storage: memoryStorage(),
    limits: {
        fileSize: (1024 * 1024) * 5,
    }
}).single("avatar");
export default singleUpload;
// const a = multer.diskStorage({
//     destination(err,req,callback){
//         callback(null,"uploads")
//     },
//     filename(req, file, callback) {
//         const ext = file.originalname.split(".").pop();
//         callback(null,)
//     },
// })
