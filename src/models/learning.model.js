import mongoose, { Schema } from "mongoose";

const learningSchema = new Schema({
    sign_video: {
        type: String,
        required: true
    },
    sign_image: {
        type: String,
        required: true
    },
    sign_name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    }
}, { timestamps: true });

export const Learning = mongoose.model("Learning", learningSchema)