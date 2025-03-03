import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createScore, getResult, getScore } from "../controllers/score.controller.js";

const router = Router();
router.post("/", verifyJWT, createScore)
router.get("/:assessment_id", verifyJWT, getScore)
router.get("/result/:assessment_id", verifyJWT, getResult)

export default router