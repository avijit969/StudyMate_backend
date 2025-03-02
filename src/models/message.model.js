import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
    sender: {
        type: String,
        enum: ["user", "bot"],
        required: true
    },
    text: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
})

export const Message = mongoose.model("Message", messageSchema);