import { Router } from "express";

import { addComment, deleteComment, getComments, updateComment } from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()
router.route("/:post_id").post(verifyJWT, addComment)
router.route("/:post_id").get(verifyJWT, getComments)
router.route('/:comment_id').delete(verifyJWT, deleteComment)
router.route('/:comment_id').patch(verifyJWT, updateComment)

export default router
