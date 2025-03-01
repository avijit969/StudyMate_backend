import mongoose, { Schema } from "mongoose";

const progressSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    course_id: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    completed_topics: [{
        type: Schema.Types.ObjectId,
        ref: "Topic"
    }],
    progress_percentage: {
        type: Number,
        default: 0
    },
    total_topics: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

export const Progress = mongoose.model("Progress", progressSchema);