import mongoose, { Schema } from "mongoose";

const historySchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    history: [{
        type: Schema.Types.ObjectId,
        ref: "Learning",
        required: true
    }]
}, {
    timestamps: true
})

export const History = mongoose.model("History", historySchema);