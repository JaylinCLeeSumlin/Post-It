http = require("node:http");
EventEmitter = require("node:events");
// document = require("/Users/jayli/OneDrive/school_projects/CCIS-493-Senior-Design/Post-It/frontend/PostIt.html")

server = http.createServer();
server.listen(8000);

console.log('Server running at http://127.0.0.1:8000/');

emitter = new EventEmitter()

// sign up
emitter.on("sign-up", () => {
    console.log("Sign up complete!")
})

// emitter.emit("sign-up")

// log in
emitter.on("log-in", () => {
    document.getElementById("login").innerHTML = "<h3>Log in complete!</h3>"
    console.log("Log in complete!")
})

// emitter.emit("log-in")

// create task
emitter.on("create-task", () => {
    document.getElementById("create-task").innerHTML = "<h3>Task created!</h3>"
    console.log("Task created!")
})

emitter.emit("create-task")