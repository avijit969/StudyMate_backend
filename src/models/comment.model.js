import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema({
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
    comment: {
        type: String,
        required: true
    },
}, { timestamps: true })

export const Comment = mongoose.model("Comment", commentSchema);