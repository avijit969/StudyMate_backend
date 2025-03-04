import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    post_id: {
        type: Schema.Types.ObjectId,
        ref: "Learning",
        required: true
    },
    is_like: {
        type: Boolean,
        default: true
    }
})

export const Like = mongoose.model("Like", likeSchema);