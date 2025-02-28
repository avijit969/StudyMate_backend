import mongoose, { Schema } from "mongoose";

const assessmentSchema = new Schema({
    questions: [
        {
            question: {
                type: String,
                required: true
            },
            answerIndex: {
                type: Number,
                required: true
            },
            options: {
                type: [String],
                required: true
            }
        }
    ]
}, { timestamps: true });

export const Assignment = mongoose.model("Assignment", assessmentSchema);