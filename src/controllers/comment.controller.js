import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addComment = asyncHandler(async (req, res) => {
    const { post_id } = req.params;
    const { comment } = req.body;
    console.log(post_id, comment)
    const user = req.user._id;
    if (!comment) {
        throw new ApiError(400, "comment is required")
    }
    if (!post_id) {
        throw new ApiError(400, "post_id is required")
    }
    const newComment = await Comment.create({
        user_id: user,
        post_id: post_id,
        comment: comment
    })
    return res.json(new ApiResponse(200, newComment, "Comment added successfully"))
})
const getComments = asyncHandler(async (req, res) => {
    const { post_id } = req.params;
    if (!post_id) {
        throw new ApiError(400, "post_id is required")
    }
    const comments = await Comment.find({ post_id: post_id })
    return res.json(new ApiResponse(200, comments, "Comments fetched successfully"))
})
const deleteComment = asyncHandler(async (req, res) => {
    const { comment_id } = req.params;
    if (!comment_id) {
        throw new ApiError(400, "comment_id is required")
    }
    const comment = await Comment.findById(comment_id)
    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }
    await Comment.findByIdAndDelete(comment_id)
    return res.json(new ApiResponse(200, comment, "Comment deleted successfully"))
})
const updateComment = asyncHandler(async (req, res) => {
    const { comment_id } = req.params;
    const { comment } = req.body;
    if (!comment_id) {
        throw new ApiError(400, "comment_id is required")
    }
    const finalComment = await Comment.findById(comment_id)
    if (!finalComment) {
        throw new ApiError(404, "Comment not found")
    }
    finalComment.comment = comment
    await finalComment.save()
    return res.json(new ApiResponse(200, finalComment, "Comment updated successfully"))
})

export { addComment, getComments, deleteComment, updateComment }