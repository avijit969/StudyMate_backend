import { Router } from "express";
import { upload } from "../middlewares/multer.middeleware.js";
import { createLearningVideo, deleteVideoById, editVideoById, getAllLearningVideo, getAllVideosByUser, getLearningVideoByCategory, getLearningVideoById, getLearningVideoByName } from "../controllers/learning.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/learning_video").post(verifyJWT, upload.fields([{ name: "learning_video", maxCount: 1 }, { name: "thumbnail", maxCount: 1 }]), createLearningVideo)
router.route("/learning_video/:id").patch(verifyJWT, upload.fields([{ name: "learning_video", maxCount: 1 }, { name: "thumbnail", maxCount: 1 }]), editVideoById)
router.route("/learning_video/:id").delete(verifyJWT, deleteVideoById)
router.route("/all_video/:page/:limit").get(verifyJWT, getAllLearningVideo)
router.route("/user_videos/:page/:limit").get(verifyJWT, getAllVideosByUser)
router.route("/video/:id").get(verifyJWT, getLearningVideoById)
router.route("/video_category/:category").get(verifyJWT, getLearningVideoByCategory)
router.route("/video_name/:title").get(verifyJWT, getLearningVideoByName)

export default router