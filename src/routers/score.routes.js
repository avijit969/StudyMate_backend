import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createScore, getAllScores, getResult, getScore } from "../controllers/score.controller.js";

const router = Router();
router.post("/", verifyJWT, createScore)
router.get("/:assessment_id", verifyJWT, getScore)
router.get("/result/:assessment_id", verifyJWT, getResult)
router.get("/score/all", verifyJWT, getAllScores)
export default router