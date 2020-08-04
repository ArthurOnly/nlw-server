import { Request, Response } from "express"

import db from "../database/connection"

export async function createConnection(req: Request, res: Response) {
  const { user_id } = req.body

  await db("connections").insert({ user_id })

  return res.status(201).json({ message: "success" })
}

export async function indexConnection(req: Request, res: Response) {
  const totalConnections = await db("connections").count("* as total")
  const total = totalConnections[0]
  return res.json({ total })
}
