import { Learning } from "../models/learning.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteImageByPublicId, uploadOnCloudinary } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
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

// get all learning
const getAllLearningVideos = asyncHandler(async (req, res) => {
    const learning = await Learning.find();
    return res.json(new ApiResponse(200, learning, "Learning fetched successfully"));
})

// get bye sign_name
const getSignByName = asyncHandler(async (req, res) => {
    const { sign_name } = req.params;
    console.log(sign_name)
    if (!sign_name) {
        throw new ApiError(400, "sign_name is required")
    }
    const learning = await Learning.find({ sign_name: sign_name.toUpperCase() })
    if (learning.length === 0) {
        throw new ApiError(404, `learning not found for ${sign_name} sign_name`)
    }
    return res.json(new ApiResponse(200, learning, "learning fetched successfully"))
})
const updateSign = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { sign_name, category } = req.body;
    const { sign_video, sign_image } = req.files;

    // Validate required fields
    if (!id) {
        throw new ApiError(400, "id is required");
    }
    if (!sign_video && !sign_image) {
        throw new ApiError(400, "At least one of sign_video or sign_image is required");
    }

    // Find the learning document
    const learn = await Learning.findById(id);
    if (!learn) {
        throw new ApiError(404, "Learning not found");
    }

    let sign_video_url = learn.sign_video;
    let sign_image_url = learn.sign_image;

    try {
        // Handle video update
        if (sign_video) {
            if (learn.sign_video) {
                await deleteImageByPublicId(learn.sign_video, "video");
            }
            sign_video_url = (await uploadOnCloudinary(sign_video[0].path)).url;
        }

        // Handle image update
        if (sign_image) {
            if (learn.sign_image) {
                await deleteImageByPublicId(learn.sign_image, "image");
            }
            sign_image_url = (await uploadOnCloudinary(sign_image[0].path)).url;
        }

        // Update the document
        const updatedLearning = await Learning.findByIdAndUpdate(
            id,
            {
                sign_video: sign_video_url,
                sign_image: sign_image_url,
                sign_name,
                category,
            },
            { new: true }
        );

        return res.status(200).json(new ApiResponse(200, updatedLearning, "Learning updated successfully"));
    } catch (error) {
        throw new ApiError(500, `Error updating sign: ${error.message}`);
    }
});

const deleteSign = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new ApiError(400, "id is required");
    }
    const learning = await Learning.findById(id);
    if (!learning) {
        throw new ApiError(404, "Learning not found");
    }
    await deleteImageByPublicId(learning.sign_image, "image");
    await deleteImageByPublicId(learning.sign_video, "video");
    await Learning.findByIdAndDelete(id);
    return res.status(200).json(new ApiResponse(200, {}, "Learning deleted successfully"));
});


export { createLearningVideo, updateSign, deleteSign, getSignByName }