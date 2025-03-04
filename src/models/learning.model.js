import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const learningSchema = new Schema({
    video_url: {
        type: String,
        required: true,
    },
    video_type: {
        type: String,
        enum: ["long", "short"],
        default: "long",
    },
    title: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    uploaded_by: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    likes: {
        type: Number,
        default: 0,
    },
    dislikes: {
        type: Number,
        default: 0,
    },
    length: {
        type: String,
        required: true,
    },
}, { timestamps: true });
learningSchema.plugin(mongooseAggregatePaginate)
export const Learning = mongoose.model("Learning", learningSchema)