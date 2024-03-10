// api/index.js
const express = require("express")
const mysql = require("mysql")
const bodyParser = require("body-parser")
const cors = require("cors")
const serverless = require("serverless-http")
const app = express()

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
})

db.connect((err) => {
  if (err) throw err
  console.log("Connected to MySQL database")
})

app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
app.options("*", cors())

app.get("/v1/jam", (req, res) => {
  const sql = "select * from jam"
  db.query(sql, (err, result) => {
    if (err) throw err
    res.json({ data: result })
  })
})

app.post("/v1/updateJam", (req, res) => {
  const { jam, aktif } = req.body
  const sql = "UPDATE jam SET aktif = ? WHERE jam = ?"
  db.query(sql, [aktif, jam], (err, result) => {
    if (err) throw err
    res.status(200).json({ msg: "Berhasil memperbarui nilai aktif" })
  })
})

const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

module.exports = app
module.exports.handler = serverless(app)
