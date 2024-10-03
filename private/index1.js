const express = require("express");
const app = express();
const path = require("/Users/jayli/OneDrive/school_projects/CCIS-493-Senior-Design/Post-It/public/index.html")

// Serve satic files from public folder
app.use(express.static(path.join(__dirname, "public")))

// Define a route for home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"))
})

// Start server
app.listen(8000, () => {
    console.log("Server listening on port 8000")
})

emitter = new EventEmitter()

// sign up
emitter.on("sign-up", () => {

    // userName = function to check if entered userName meets requirements
    const userName = () => {}

    // email = function to check if entered email meets requirements
    const email = () => {}

    // password = function to check if entered password meets requirements
    const password = () => {}

    // Add approved userName, email, and password to database

    console.log("Sign up complete!")
})

// emitter.emit("sign-up")

// log in
emitter.on("log-in", () => {
    document.getElementById("login").innerHTML = "<h3>Log in complete!</h3>"

    // userName = function to check if userName exists in database
    const userName = () => {}

    // email = function to check if email exists in database
    const email = () => {}

    // password = function to check if encrypted version of entered password is in database
    const password = () => {}

    // Allow user to log in

    console.log("Log in complete!")
})

// emitter.emit("log-in")

// create task
emitter.on("create-task", () => {
    document.getElementById("create-task").innerHTML = "<h3>Task created!</h3>"
    console.log("Task created!")
})

emitter.emit("create-task")