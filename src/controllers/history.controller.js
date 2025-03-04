import { History } from "../models/history.model.js";
import { Learning } from "../models/learning.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addVideoToHistory = asyncHandler(async (req, res) => {
    const { learning_video_id } = req.params;
    if (!learning_video_id) {
        throw new ApiError(400, "video_id is required")
    }
    const video = await Learning.findById({ _id: learning_video_id })
    if (!video) {
        throw new ApiError(404, "Video not found")
    }
    const user = req.user._id;
    const history = await History.findOne({ user_id: user })
    if (!history) {
        await History.create({
            user_id: user,
            history: [learning_video_id]
        })
        return res.json(new ApiResponse(200, history, "Video added to history successfully"))
    }

    const videoIndex = history.history.findIndex(video => video.toString() === learning_video_id)
    if (videoIndex === -1) {
        history.history.push(learning_video_id)
        await history.save()
        return res.json(new ApiResponse(200, history, "Video added to history successfully"))
    }
    return res.json(new ApiResponse(200, history, "Video already in history"))
})

const getHistory = asyncHandler(async (req, res) => {
    const user = req.user._id;
    console.log(user);
    const history = await History.aggregate([
        {
            $match: {
                user_id: user
            }
        },
        {
            $unwind: "$history"  // Unwind the array first
        },
        {
            $lookup: {
                from: "learnings",
                localField: "history",  // Match the ObjectId field
                foreignField: "_id",
                as: "history"
            }
        },
        {
            $unwind: "$history"  // Extract object from array
        },
        {
            $project: {
                _id: 0,
                video_id: "$history._id",
                title: "$history.title",
                description: "$history.description",
                thumbnail: "$history.thumbnail",
                video_url: "$history.video_url",
                video_type: "$history.video_type",
            }
        }
    ]);

    console.log(history);
    return res.json(new ApiResponse(200, history, "History fetched successfully"));
});

const deleteVideoFromHistory = asyncHandler(async (req, res) => {
    const { learning_video_id } = req.params;
    if (!learning_video_id) {
        throw new ApiError(400, "video_id is required")
    }
    const video = await Learning.findById({ _id: learning_video_id })
    if (!video) {
        throw new ApiError(404, "Video not found")
    }
    const user = req.user._id;
    const history = await History.findOne({ user_id: user })
    if (!history) {
        throw new ApiError(404, "History not found")
    }
    const videoIndex = history.history.findIndex(video => video.toString() === learning_video_id)
    if (videoIndex === -1) {
        throw new ApiError(404, "Video not found in history")
    }
    history.history.splice(videoIndex, 1)
    await history.save()
    return res.json(new ApiResponse(200, history, "Video deleted from history successfully"))
})
const clearHistory = asyncHandler(async (req, res) => {
    const user = req.user._id;
    const history = await History.findOne({ user_id: user })
    if (!history) {
        throw new ApiError(404, "History not found")
    }
    history.history = []
    await history.save()
    return res.json(new ApiResponse(200, history, "History cleared successfully"))
})


export { addVideoToHistory, getHistory, deleteVideoFromHistory, clearHistory }