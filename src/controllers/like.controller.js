import { Learning } from "../models/learning.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createLike = asyncHandler(async (req, res) => {
    const { learning_video_id } = req.params;
    if (!learning_video_id) {
        throw new ApiError(400, "video_id is required")
    }
    const video = await Learning.findById({ _id: learning_video_id })
    if (!video) {
        throw new ApiError(404, "Video not found")
    }
    const user = req.user._id;
    const like = await Like.findOne({ user_id: user })
    if (!like) {
        await Like.create({
            user_id: user,
            post_id: learning_video_id,
            is_like: true
        })
        return res.json(new ApiResponse(200, like, "Video liked successfully"))
    }
    else {
        await Like.updateOne({ user_id: user }, { $set: { is_like: !like.is_like } })
        return res.json(new ApiResponse(200, like, "Video liked successfully"))
    }
})

const getLikes = asyncHandler(async (req, res) => {
    const { learning_video_id } = req.params;
    if (!learning_video_id) {
        throw new ApiError(400, "video_id is required")
    }
    const video = await Learning.findById({ _id: learning_video_id })
    if (!video) {
        throw new ApiError(404, "Video not found")
    }
    const likes = await Like.find({ post_id: learning_video_id })
    return res.json(new ApiResponse(200, { likes, like_count: likes.length }, "Likes fetched successfully"))
})

export { createLike, getLikes }