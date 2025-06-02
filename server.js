const express = require("express")
const app = express()
const cors = require("cors")
const path = require("path")

const port = 5050

app.use(cors())
app.use(express.json())
app.use(require("./servidor/routes/user"))

app.set("views", path.join(__dirname, "servidor", "views"))
app.set("view engine", "pug")

const dbo = require("./servidor/db/conn")

app.get("/", function(req, res) {
    res.render('tela', { title: 'Express' });
})

dbo.connectToMongoDB(function (error) {
    if (error) throw error

    app.listen(port, () => {
        console.log("Servidor rodando na porta: " + port)
    })
})