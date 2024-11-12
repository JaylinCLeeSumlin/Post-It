
var express = require("express")

var app = express ()
var logger = require("morgan")
var cookieParser = require("cookie-parser")
const session = require("express-session")
var path = require("path")
var classes = require ("./db")

//const { User, Task } = require("./db");

app.set('view engine', 'ejs');

// terminal (Git Bash) --> mktemp
app.use(session({secret:"M88CYahP1OfTd6s6dCiq"}))

// Pass request through multuple filters before hitting get/post requests
app.use(logger('dev'))

// Convert request into json
app.use(express.json())

app.use(express.urlencoded({extended:false}))

app.use(cookieParser())

// __dirname = reference to current directory aka root directory
app.use(express.static(path.join(__dirname, 'public')))

// QUESTION: how do I get / to go to the home page?
app.get("/", (req, res) => {
    //var task = classes.Task(null,)
   res.send(classes.Task.getAllTasksWithTagsByUser(14))
})


app.listen(3000)