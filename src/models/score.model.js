import mongoose, { Schema } from "mongoose";
const resultSchema = Schema({
    question_id: {
        type: Schema.Types.ObjectId,
        ref: "Question",
        required: true
    },
    user_answer_index: {
        type: Number,
        required: true
    },
    correct_answer_index: {
        type: Number,
        required: true
    }
})
export const Result = mongoose.model("Result", resultSchema);
const scoreSchema = Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    assessment_id: {
        type: Schema.Types.ObjectId,
        ref: "Assessment",
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
    },
    result: {
        type: [resultSchema],
        required: true
    }
})

export const Score = mongoose.model("Score", scoreSchema);