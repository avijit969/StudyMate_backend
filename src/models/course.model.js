import mongoose, { Schema } from "mongoose";

const courseSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    category: {
        type: String
    },
    topics: [{
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        topicVideo: {
            type: String
        },
        explanation: {
            type: String
        }
    }],
    uploaded_by: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    assignment: {
        type: Schema.Types.ObjectId,
        ref: "Assignment"
    },
    likes: {
        type: Number,
        default: 0,
    },
    views: {
        type: Number,
        default: 0,
    },
    isPublic: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export const Course = mongoose.model("Course", courseSchema, "Course");