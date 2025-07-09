import { Learning } from "../models/learning.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteImageByPublicId, uploadOnCloudinary } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Types } from "mongoose";
const createLearningVideo = asyncHandler(async (req, res) => {
    const { title, category, description, video_type } = req.body;
    const { learning_video, thumbnail } = req.files;
    if (!title || !category || !description) {
        throw new ApiError(400, "title, category and description are required");
    }
    if (!learning_video || !thumbnail) {
        throw new ApiError(400, "learning_video and thumbnail are required");
    }
    const { secure_url: learning_video_url, duration } = await uploadOnCloudinary(learning_video[0].path);
    const { secure_url: thumbnail_url } = await uploadOnCloudinary(thumbnail[0].path);
    const learning = await Learning.create({
        title,
        category,
        description,
        video_type,
        video_url: learning_video_url,
        thumbnail: thumbnail_url,
        length: duration,
        uploaded_by: req.user._id,
    });
    return res.status(201).json(new ApiResponse(201, learning, "Learning video created successfully"));
});

const getAllLearningVideo = asyncHandler(async (req, res) => {
    const { page, limit } = req.params;
    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
    };

    try {
        const result = await Learning.aggregatePaginate(
            Learning.aggregate([{ $match: {} }]), // Pass pipeline directly
            options
        );

        return res.status(200).json(new ApiResponse(200, result, "Learning videos fetched successfully"));
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to fetch learning videos" });
    }
});

const getLearningVideoById = asyncHandler(async (req, res) => {
    console.log("Fetching learning video by ID");
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid ID format");
    }

    const learning = await Learning.aggregate([
        { $match: { _id: new Types.ObjectId(id) } },
        {
            $lookup: {
                from: "users",
                localField: "uploaded_by",
                foreignField: "_id",
                as: "uploader"
            }
        },
        { $unwind: "$uploader" },
        {
            $project: {
                "uploader._id": 1,
                "uploader.username": 1,
                "uploader.fullName": 1,
                "uploader.avatar": 1,
                title: 1,
                category: 1,
                description: 1,
                video_url: 1,
                video_type: 1,
                thumbnail: 1,
            }
        }
    ]);

    if (learning.length === 0) {
        throw new ApiError(404, "Learning video not found");
    }

    return res.status(200).json(
        new ApiResponse(200, learning[0], "Learning video fetched successfully")
    );
});


const getLearningVideoByCategory = asyncHandler(async (req, res) => {
    const { category } = req.params;
    const learning = await Learning.find({ category });
    if (!learning) {
        throw new ApiError(404, "Learning video not found");
    }
    return res.status(200).json(new ApiResponse(200, learning, "Learning video fetched successfully"));
});

const getLearningVideoByName = asyncHandler(async (req, res) => {
    const { title } = req.params;
    // find the learning video by not case sensitive and exact match find similarity
    const learning = await Learning.find({ title: { $regex: title, $options: "i" } });
    if (!learning) {
        throw new ApiError(404, "Learning video not found");
    }
    return res.status(200).json(new ApiResponse(200, learning, "Learning video fetched successfully"));
});

export { createLearningVideo, getAllLearningVideo, getLearningVideoById, getLearningVideoByCategory, getLearningVideoByName }