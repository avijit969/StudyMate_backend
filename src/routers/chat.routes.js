import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { chatForAssistant, chatForQNA } from "../controllers/buzzy.controller.js";

const router = Router()
router.route("/qna").post(verifyJWT, chatForQNA)
router.route("/assistant").post(verifyJWT, chatForAssistant)


export default router