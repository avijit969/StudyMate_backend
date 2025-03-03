import { Assignment } from "../models/assignmates.model.js";
import { Score } from "../models/score.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createScore = asyncHandler(async (req, res) => {
    const { assignment_id, correct_answers, wrong_answers, time_taken, score, result } = req.body;
    if (!score || !assignment_id) {
        throw new ApiError(400, "score and assignment_id is required")
    }
    //find score
    const isScoreAlreadyCreated = await Score.findOne({ assessment_id: assignment_id, user_id: req.user._id })
    if (isScoreAlreadyCreated) {
        throw new ApiError(400, "Score already created")
    }
    // find assignment
    const assignment = await Assignment.findById(assignment_id);
    if (!assignment) {
        throw new ApiError(404, "Assignment not found")
    }
    // find user
    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, "User not found")
    }

    // create score
    const createdScore = await Score.create({
        user_id: user._id,
        score,
        total_questions: assignment.questions.length,
        assessment_id: assignment._id,
        correct_answers: correct_answers,
        wrong_answers: wrong_answers,
        time_taken: time_taken,
        result
    })
    if (!score) {
        throw new ApiError(500, "Error creating score")
    }
    return res.json(new ApiResponse(200, createdScore, "Score created successfully"))
});

const getScore = asyncHandler(async (req, res) => {
    const { assessment_id } = req.params
    if (!assessment_id) {
        throw new ApiError(400, "assessment_id is required")
    }
    const score = await Score.findOne({ assessment_id: assessment_id, user_id: req.user._id })
    if (!score) {
        throw new ApiError(404, "Score not found")
    }
    return res.json(new ApiResponse(200, score, "Score fetched successfully"))
})
const getResult = asyncHandler(async (req, res) => {
    const { assessment_id } = req.params
    if (!assessment_id) {
        throw new ApiError(400, "assessment_id is required")
    }
    const score = await Score.findOne({ assessment_id: assessment_id, user_id: req.user._id })
    if (!score) {
        throw new ApiError(404, "Score not found")
    }
    const result = score.result
    return res.json(new ApiResponse(200, result, "Score fetched successfully"))
})

export { createScore, getScore, getResult }