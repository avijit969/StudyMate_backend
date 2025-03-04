import { Router } from "express";
import { upload } from "../middlewares/multer.middeleware.js";
import { createLearningVideo, getAllLearningVideo } from "../controllers/learning.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/learning_video").post(verifyJWT, upload.fields([{ name: "learning_video", maxCount: 1 }, { name: "thumbnail", maxCount: 1 }]), createLearningVideo)
router.route("/:page/:limit").get(verifyJWT, getAllLearningVideo)

export default router