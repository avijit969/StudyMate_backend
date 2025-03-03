import { Course } from "../models/course.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getImageFromUnsplash } from "../utils/images/getImagesFromUnflash.js";
import { generateCourse, generateCourseAssessment } from "../utils/openAI/generateCourse.js";
import { getYouTubeVideoByTopic } from "../utils/yt_video/getVideoFromYT.js";
import { Learning } from "../models/learning.model.js";
import { Assignment } from "../models/assignmates.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { Progress } from "../models/progress.model.js"
const generateCourseUsingAI = asyncHandler(async (req, res) => {

    const { course_name } = req.body;
    if (!course_name) {
        throw new ApiError(400, "course_name is required");
    }

    // Call AI service to generate course content
    const course = await generateCourse(course_name);
    if (!course) {
        throw new ApiError(500, "Error generating course");
    }

    console.log("Generated course:", course);

    // Process topics: Check video availability or fetch from YouTube
    const topics = await Promise.all(
        course.topics.map(async (topic) => {
            let topicVideo = await Learning.findOne({ title: { $regex: topic.title, $options: "i" } })?.videoUrl;
            if (!topicVideo) {
                topicVideo = await getYouTubeVideoByTopic(`${course.course_name} ${topic.title}`);
            }
            return {
                title: topic.title,
                description: topic.description,
                explanation: topic.explanation,
                topicVideo
            };
        })
    );

    // Generate course thumbnail
    const thumbnail = await getImageFromUnsplash(course_name);
    if (!thumbnail) {
        throw new ApiError(500, "Error generating thumbnail");
    }

    // Create and save the course in the database
    const createdCourse = await Course.create({
        name: course_name,
        description: course.description,
        topics,
        uploaded_by: req.user._id,
        thumbnail
    });

    if (!createdCourse) {
        throw new ApiError(500, "Error saving course");
    }

    return res.json(new ApiResponse(200, createdCourse, "Course generated successfully"));
});

const getCourses = asyncHandler(async (req, res) => {
    const user = req.user._id;
    const courses = await Course.aggregate([
        {
            $match: {
                uploaded_by: user
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "uploaded_by",
                foreignField: "_id",
                as: "uploadedBy"
            }
        },
        {
            $unwind: "$uploadedBy"
        },
        {
            $project: {
                name: 1,
                description: 1,
                thumbnail: 1,
                likes: 1,
                views: 1,
                createdAt: 1,
                uploadedBy: {
                    name: "$uploadedBy.fullName",
                    email: "$uploadedBy.email",
                    profileImage: "$uploadedBy.avatar"
                },
                assignment: 1
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        }
    ])
    if (!courses) {
        throw new ApiError(404, "Courses not found");
    }
    for (const course of courses) {
        const progress = await Progress.findOne({ course_id: course._id, user_id: user });
        if (progress) {
            course.progress_percentage = progress.progress_percentage;
        } else {
            course.progress_percentage = 0;
        }
    }

    return res.json(new ApiResponse(200, courses));
});

const getCourseById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
        throw new ApiError(404, "Course not found");
    }
    return res.json(new ApiResponse(200, course));
});

const deleteCourse = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const course = await Course.findByIdAndDelete(id);
    if (!course) {
        throw new ApiError(404, "Course not found");
    }
    return res.json(new ApiResponse(200, course));
});

// update course details
const updateCourse = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, description, topics } = req.body;
    const thumbnailLocalPath = req.file?.path;

    // upload thumbnail to cloudinary
    const { secure_url: thumbnailUrl } = await uploadOnCloudinary(thumbnailLocalPath);
    if (!thumbnailUrl) {
        throw new ApiError(500, "Error uploading thumbnail");
    }

    const course = await Course.findByIdAndUpdate(id, {
        name,
        description,
        topics,
        thumbnail: thumbnailUrl.url
    }
        , { new: true });
    if (!course) {
        throw new ApiError(404, "Course not found");
    }

    return res.json(new ApiResponse(200, course));
})
const generateAssignment = asyncHandler(async (req, res) => {
    const { id: courseId } = req.params;
    console.log("courseId", courseId);
    const course = await Course.findById(courseId);
    if (!course) {
        throw new ApiError(404, "Course not found");
    }
    // Check if assignment is already generated
    if (course.assignment) {
        throw new ApiError(400, "Assignment already generated");
    }
    // Generate assignment
    const assignment = await generateCourseAssessment(course.name);
    if (!assignment) {
        throw new ApiError(500, "Error generating assignment");
    }
    // Save assignment to the course
    const assignmentData = await Assignment.create({
        questions: assignment.questions
    })
    if (!assignmentData) {
        throw new ApiError(500, "Error saving assignment");
    }
    // Update course with assignment
    course.assignment = assignmentData._id;
    await course.save();

    return res.json(new ApiResponse(200, assignmentData, "Assignment generated successfully"));
})

// get assignments by id
const getAssignmentsById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const assignment = await Assignment.findById(id);
    if (!assignment) {
        throw new ApiError(404, "Assignment not found");
    }
    return res.json(new ApiResponse(200, assignment));
})

// get topic by topic id and course id
const getTopicByCourseAndTopicId = asyncHandler(async (req, res) => {
    const { id, course_id } = req.params;
    console.log("id", id, "course_id", course_id);
    const course = await Course.findById(course_id);
    if (!course) {
        throw new ApiError(404, "Course not found");
    }
    const topic = course.topics.find(topic => topic._id.toString() === id);
    if (!topic) {
        throw new ApiError(404, "Topic not found");
    }
    return res.json(new ApiResponse(200, topic));
})
const updateTopic = asyncHandler(async (req, res) => {
    const { id, course_id } = req.params;
    const { isCompleted, isEnabled } = req.body;
    const course = await Course.findById(course_id);
    if (!course) {
        throw new ApiError(404, "Course not found");
    }
    const topic = course.topics.find(topic => topic._id.toString() === id);
    if (!topic) {
        throw new ApiError(404, "Topic not found");
    }
    topic.isCompleted = isCompleted;
    topic.isEnabled = isEnabled;
    await course.save();
    return res.json(new ApiResponse(200, topic));
})

export { generateCourseUsingAI, getCourses, getCourseById, deleteCourse, updateCourse, generateAssignment, getAssignmentsById, getTopicByCourseAndTopicId, updateTopic };

