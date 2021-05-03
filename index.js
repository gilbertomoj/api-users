var bodyParser = require('body-parser')
var express = require("express")
var app = express()
var router = require("./routes/routes")
var cors = require("cors");
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors());
// parse application/json
app.use(bodyParser.json())

app.use("/",router);

app.listen(8080,() => {
    console.log("Servidor rodando")
});
