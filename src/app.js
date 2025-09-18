import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3001",
  credentials: true
}))


app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))
app.use(express.static("public"))
app.use(cookieParser())

import userRouter from './routers/user.routs.js'
import learningRouter from './routers/learning.routes.js'
import courseRouter from './routers/course.routes.js'
import progressRouter from "./routers/progress.routes.js"
import chatRouter from "./routers/chat.routes.js"
import scoreRouter from "./routers/score.routes.js"
import commentRouter from "./routers/comment.routes.js"
import historyRouter from "./routers/history.routes.js"
import likeRouter from "./routers/like.routes.js"
import { errorHandler } from "./middlewares/error.middlewares.js"

//routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/learning", learningRouter)
app.use("/api/v1/course", courseRouter)
app.use("/api/v1/progress", progressRouter)
app.use("/api/v1/chat", chatRouter)
app.use("/api/v1/score", scoreRouter)
app.use("/api/v1/comment", commentRouter)
app.use("/api/v1/history", historyRouter)
app.use("/api/v1/like", likeRouter)
app.use("/api/v1/health", (req, res, next) => {
  res.status(200).json({ message: "OK" });
});
app.use(errorHandler)
export { app }