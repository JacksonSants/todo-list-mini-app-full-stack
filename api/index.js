import express from "express"
import taskRouters from "./routes/tasks.js"
import cors from "cors"

const app = express()

app.use(express.json())
app.use(cors())

app.use("/", taskRouters)

app.listen(8000)