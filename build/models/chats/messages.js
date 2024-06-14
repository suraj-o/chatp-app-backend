import mongoose, { Schema } from "mongoose";
const schema = new Schema({
    sender: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    chat: {
        type: mongoose.Types.ObjectId,
        ref: "Chats"
    },
    content: String,
    attachment: [
        {
            public_Id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ]
}, {
    timestamps: true
});
export const Messages = mongoose.model("Messages", schema);
