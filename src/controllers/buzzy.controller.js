import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { chatWithBuzzyForAssignmentQuestions, chatWithBuzzyForAssistant } from "../utils/openAI/buzzy.js";

const chatForQNA = asyncHandler(async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
        throw new ApiError(400, "Prompt is required");
    }
    const response = await chatWithBuzzyForAssignmentQuestions(prompt);
    return res.json(new ApiResponse(200, { "buzzy": response }));
});
const chatForAssistant = asyncHandler(async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
        throw new ApiError(400, "Prompt is required");
    }
    const response = await chatWithBuzzyForAssistant(prompt);
    return res.json(new ApiResponse(200, { "buzzy": response }));
});

export { chatForQNA, chatForAssistant };