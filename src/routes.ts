import express from "express"
import { createClass, indexClass } from "./controllers/ClassesController"

const routes = express.Router()

routes.get("/classes", indexClass)
routes.post("/classes", createClass)

export default routes
