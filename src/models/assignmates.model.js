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

const assignmentTrackSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    assignment_id: {
        type: Schema.Types.ObjectId,
        ref: "Assignment",
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    total_questions: {
        type: Number,
        required: true
    },
    correct_answers: {
        type: Number,
        required: true
    },
    wrong_answers: {
        type: Number,
        required: true
    },
    time_taken: {
        type: Number,
        required: true
    }
})

export const Assignment = mongoose.model("Assignment", assessmentSchema);