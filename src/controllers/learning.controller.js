import { Learning } from "../models/learning.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteImageByPublicId, uploadOnCloudinary } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const createLearning = asyncHandler(async (req, res) => {
    const { sign_name, category } = req.body;
    const { sign_video, sign_image } = req.files;
    if (!sign_video && !sign_image) {
        throw new ApiError(400, "sign_video and sign_image is required")
    }

    // upload files into the cloudinary
    const sign_video_url = await uploadOnCloudinary(sign_video[0].path);
    const sign_image_url = await uploadOnCloudinary(sign_image[0].path);

    const learning = await Learning.create({
        sign_video: sign_video_url.url,
        sign_image: sign_image_url.url,
        sign_name,
        category
    })
    return res.status(201).json(new ApiResponse(201, learning, "learning created successfully"))
});

// get all learning
const getLearningByCategory = asyncHandler(async (req, res) => {
    const { category } = req.params;
    if (!category) {
        throw new ApiError(400, "category is required")
    }
    const learning = await Learning.find({ category })
    if (learning.length === 0) {
        throw new ApiError(404, `learning not found for ${category} category`)
    }
    return res.status(200).json(new ApiResponse(200, learning, "learning fetched successfully"))
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


export { createLearning, getLearningByCategory, updateSign, deleteSign, getSignByName }