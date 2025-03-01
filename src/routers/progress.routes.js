import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createProgress, getProgress, updateProgress } from "../controllers/progress.controller.js";

const router = Router()
router.route("/:course_id").post(verifyJWT, createProgress)
router.route("/:course_id").get(verifyJWT, getProgress)
router.route("/:course_id/:topic_id").patch(verifyJWT, updateProgress)

export default router