import { Course } from "../models/course.model.js";
import { Progress } from "../models/progress.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const createProgress = asyncHandler(async (req, res) => {
    const { course_id } = req.params
    if (!course_id) {
        throw new ApiError(400, "course_id is required")
    }
    // get topics by course_id
    const course = await Course.findById(course_id)
    if (!course) {
        throw new ApiError(404, "Course not found")
    }
    const topics = course.topics
    const progress = await Progress.create({
        course_id: course_id,
        user_id: req.user._id,
        completed_topics: [],
        progress_percentage: 0,
        total_topics: topics.length,
    })
    if (!progress) {
        throw new ApiError(500, "Error creating progress")
    }
    return res.json(new ApiResponse(200, progress, "Progress created successfully"))
})
const updateProgress = asyncHandler(async (req, res) => {
    const { course_id, topic_id } = req.params
    if (!course_id || !topic_id) {
        throw new ApiError(400, "course_id and topic_id is required")
    }
    const progress = await Progress.findOne({ course_id: course_id, user_id: req.user._id })
    if (!progress) {
        throw new ApiError(404, "Progress not found")
    }
    const topics = progress.completed_topics
    const topic = topics.find(topic => topic.toString() === topic_id)
    if (topic) {
        throw new ApiError(400, "Topic already completed")
    }
    topics.push(topic_id)
    progress.progress_percentage = (topics.length / progress.total_topics) * 100
    progress.completed_topics = topics
    await progress.save()
    return res.json(new ApiResponse(200, progress, "Progress updated successfully"))
})
const getProgress = asyncHandler(async (req, res) => {
    const { course_id } = req.params
    if (!course_id) {
        throw new ApiError(400, "course_id is required")
    }
    const progress = await Progress.findOne({ course_id: course_id, user_id: req.user._id })
    if (!progress) {
        throw new ApiError(404, "Progress not found")
    }
    return res.json(new ApiResponse(200, progress, "Progress fetched successfully"))
})

export { createProgress, updateProgress, getProgress }