import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createLike, getLikes } from "../controllers/like.controller.js";

const router = Router();
router.route("/:learning_video_id").post(verifyJWT, createLike);
router.route("/:learning_video_id").get(verifyJWT, getLikes);

export default router