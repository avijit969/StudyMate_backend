import mongoose from "mongoose";
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
    // find progress by course_id and user_id
    const isProgressAlreadyCreated = await Progress.findOne({ course_id: course_id, user_id: req.user._id })
    if (isProgressAlreadyCreated) {
        throw new ApiError(400, "Progress already created")
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
const getUserProgress = asyncHandler(async (req, res) => {
    console.log(req.user._id)
    const progressData = await Progress.aggregate([
        {
            $match: {
                user_id: new mongoose.Types.ObjectId(req.user._id)  // Ensure ObjectId type
            }
        },
        {
            $lookup: {
                from: "Course",
                localField: "course_id",
                foreignField: "_id",
                as: "course"
            }
        },
        {
            $unwind: "$course"
        },
        {
            $project: {
                _id: 1,
                course_name: "$course.name",
                progress_percentage: 1,
                course_image: "$course.thumbnail"
            }
        }
    ]);
    const completedCoursesName = progressData.filter(progress => progress.progress_percentage === 100).map(progress => progress.course_name)
    const total_course = progressData.length

    if (!progressData) {
        throw new ApiError(404, "Progress not found");
    }
    return res.json(new ApiResponse(200, { progressData, completedCoursesName, total_course }, "Progress fetched successfully"));
});


export { createProgress, updateProgress, getProgress, getUserProgress }