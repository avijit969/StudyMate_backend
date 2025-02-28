import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { deleteCourse, generateAssignment, generateCourseUsingAI, getAssignmentsById, getCourseById, getCourses, getTopicByCourseAndTopicId, updateCourse, updateTopic } from "../controllers/course.controller.js";
import { upload } from "../middlewares/multer.middeleware.js";

const router = Router()
router.route("/generate_course").post(verifyJWT, generateCourseUsingAI)
router.route("/all_courses").get(verifyJWT, getCourses)
router.route("/course/:id").get(verifyJWT, getCourseById)
router.route("/course/:id").delete(verifyJWT, deleteCourse)
router.route("/course/:id").patch(verifyJWT, upload.single("thumbnail"), updateCourse)
router.route("/assignment/:id").post(verifyJWT, generateAssignment)
router.route("/assignment/:id").get(verifyJWT, getAssignmentsById)
router.route("/topic/:id/:course_id").get(verifyJWT, getTopicByCourseAndTopicId)
router.route("/topic/:id/:course_id").patch(verifyJWT, updateTopic)
export default router