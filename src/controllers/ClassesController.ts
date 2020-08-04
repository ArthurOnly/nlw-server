import { Request, Response } from "express"
import { stringToMinutes } from "../helpers/timeConverter"

import db from "../database/connection"

interface scheduleItem {
  week_day: number
  from: string
  to: string
}

export async function indexClass(req: Request, res: Response) {
  const filters = req.query

  if (!filters.week_day || !filters.subject || !filters.time) {
    return res.status(400).json({ error: "Missing parameters" })
  }

  const timeInMinutes = stringToMinutes(filters.time as string)

  const classes = await db("classes")
    .whereExists(function () {
      this.select("class_schedule.*")
        .from("class_schedule")
        .whereRaw("`class_schedule`.`class_id`=`classes`.`id`")
        .whereRaw("`class_schedule`.`week_day`= ??", [
          Number(filters.week_day as string),
        ])
        .whereRaw("`class_schedule`.`from` <= ??", [timeInMinutes])
        .whereRaw("`class_schedule`.`to`> ??", [timeInMinutes])
    })
    .where("classes.subject", "=", filters.subject as string)
    .join("users", "classes.user_id", "=", "users.id")
    .select(["classes.*", "users.*"])

  return res.json(classes)
}

export async function createClass(req: Request, res: Response) {
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
}
