import { Router } from "express";
import { upload } from "../middlewares/multer.middeleware.js";
import { createLearningVideo, deleteSign, getLearningByCategory, getSignByName, updateSign } from "../controllers/learning.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/learning_video").post(verifyJWT, upload.fields([{ name: "learning_video", maxCount: 1 }, { name: "thumbnail", maxCount: 1 }]), createLearningVideo)
// router.route('/signs/:category').get(getLearningByCategory)
// router.route("/sign/:id").patch(upload.fields([{ name: "sign_video", maxCount: 1 }, { name: "sign_image", maxCount: 1 }]), updateSign)
// router.route("/sign/:id").delete(deleteSign)
// router.route('/signs_video/:sign_name').get(getSignByName)

export default router