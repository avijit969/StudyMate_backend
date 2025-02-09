import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
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
import yesNoQuestionRouter from './routers/practice.yes_no.routes.js'
import matchSignQuestionRouter from './routers/practice.match_sign.routes.js'
import signToTextQuestionRouter from './routers/practice.sign_to_text.routes.js'
import writeSignQuestionRouter from './routers/practice.write_sign.routes.js'
import chooseCorrectSignQuestionRouter from './routers/practice.choose_correct_sign.routes.js'
import getPracticeQuestionTopicWiseRouter from './routers/practice_topic.routes.js'
import { errorHandler } from "./middlewares/error.middlewares.js"
import createPracticeSetQuestionRouter from "./routers/practice_set.routes.js"
import handWrite from "./routers/handWrite.routes.js"
//routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/learning", learningRouter)
app.use("/api/v1/questions", yesNoQuestionRouter)
app.use("/api/v1/questions", matchSignQuestionRouter)
app.use("/api/v1/questions", signToTextQuestionRouter)
app.use("/api/v1/questions", writeSignQuestionRouter)
app.use("/api/v1/questions", chooseCorrectSignQuestionRouter)
app.use("/api/v1/practice_set", createPracticeSetQuestionRouter)
app.use("/api/v1/topic_wise_questions", getPracticeQuestionTopicWiseRouter)
app.use('/api/v1/hand_write', handWrite)
app.use(errorHandler)
export { app }