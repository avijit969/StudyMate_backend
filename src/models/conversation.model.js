import mongoose, { Schema } from "mongoose";

const conversationSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    messages: [{
        type: Schema.Types.ObjectId,
        ref: "Message",
        required: true
    }],
}, { timestamps: true })

export const Conversation = mongoose.model("Conversation", conversationSchema);
