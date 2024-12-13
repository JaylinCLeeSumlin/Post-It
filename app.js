var express = require("express")

var app = express ()
var logger = require("morgan")
var cookieParser = require("cookie-parser")
const session = require("express-session")
const { expires } = require("express-session/session/cookie")
const { randomUID } = require("crypto")
var path = require("path")

app.set('view engine', 'ejs');

// terminal (Git Bash) --> mktemp
app.use(session({
    // generate random user id for each session
    genID: (req) => {
        return randomUID
    },
    secret:"M88CYahP1OfTd6s6dCiq",
    saveUninitialized: false,
    resave: true
}))

// Pass request through multuple filters before hitting get/post requests
app.use(logger('dev'))

// Convert request into json
app.use(express.json())

app.use(express.urlencoded({extended:true}))

app.use(cookieParser())

// __dirname = reference to current directory aka root directory
app.use(express.static(path.join(__dirname, 'public')))

// QUESTION: how do I get / to go to the home page?
app.get("/", (req, res) => {
    res.render("pages/homepage")
})

var user_router = require("./routes/user_router")
// Use any route that starts with 'auth' to complete request. Redirects all routes that begin with auth
app.use("/user", user_router)

var task_router = require("./routes/task_router")
app.use("/task", task_router)

var auth_router = require("./routes/auth_router")
app.use("/auth", auth_router)


//syntax: app.get("route",(request,response))
app.get("/about", (req, res) => {
    res.send('About us page <a href="/">Home Page</a>')
})

app.listen(3000)