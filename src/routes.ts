import express from "express"
import { createClass, indexClass } from "./controllers/ClassesController"
import {
  createConnection,
  indexConnection,
} from "./controllers/ConnectionsController"

const routes = express.Router()

routes.get("/classes", indexClass)
routes.post("/classes", createClass)
routes.post("/connections", createConnection)
routes.get("/connections", indexConnection)

export default routes
