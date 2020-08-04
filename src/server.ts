import express from "express"

const app = express()
app.use(express.json())

app.get("/users", (req, res) => res.json("no ar"))

app.listen(3333)
