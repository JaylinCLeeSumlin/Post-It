var express = require("express")

var app = express ()
var logger = require("morgan")
var cookieParser = require("cookie-parser")
const session = require("express-session")
var path = require("path")

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

var home = require("./public/html/index.html")
app.use("/", home)

var auth_router = require("./routes/user_router")
// Use any route that starts with 'auth' to complete request. Redirects all routes that begin with auth
app.use("/auth", auth_router)

var task_router = require("./task_router")
app.use("/task", task_router)


//syntax: app.get("route",(request,response))
app.get("/about", (req, res) => {
    res.send('About us page <a href="/">Home Page</a>')
})

app.listen(3000)