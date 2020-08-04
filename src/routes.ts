import express from "express"
import db from "./database/connection"

import { stringToMinutes } from "./helpers/timeConverter"

const routes = express.Router()

interface scheduleItem {
  week_day: number
  from: string
  to: string
}

routes.post("/classes", async (req, res) => {
  const { name, avatar, whatsapp, bio, subject, cost, schedule } = req.body

  const trx = await db.transaction()

  try {
    const insertedsUsersIds = await trx("users").insert({
      name,
      avatar,
      whatsapp,
      bio,
    })
    const user_id = insertedsUsersIds[0]

    const insertedsClassesIds = await trx("classes").insert({
      subject,
      cost,
      user_id,
    })
    const class_id = insertedsClassesIds[0]

    const classSchedule = schedule.map((scheduleItem: scheduleItem) => {
      return {
        class_id,
        week_day: scheduleItem.week_day,
        from: stringToMinutes(scheduleItem.from),
        to: stringToMinutes(scheduleItem.to),
      }
    })
    await trx("class_schedule").insert(classSchedule)

    await trx.commit()

    return res.status(201).json({ status: "sucess" })
  } catch {
    await trx.rollback()
    return res.status(400).json({ status: "fail" })
  }
})

export default routes
