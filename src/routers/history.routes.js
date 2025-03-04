import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addVideoToHistory, clearHistory, deleteVideoFromHistory, getHistory } from "../controllers/history.controller.js";

const router = Router();
router.route("/:learning_video_id").post(verifyJWT, addVideoToHistory)
router.route("/").delete(verifyJWT, clearHistory)
router.route("/video/:learning_video_id").delete(verifyJWT, deleteVideoFromHistory)
router.route("/").get(verifyJWT, getHistory)

export default router