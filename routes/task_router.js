var express = require("express")
const Task = require("../database/Task")
const User = require("../database/User")

var router = express.Router()

router.get("/", (req, res) => {
    // get email
    userID = req.session.userID

    try {
        // access tasks based on email
        result = [];
        tasks = Task.getAllTasksWithTagsByUser(userID, (error, data) => {
            if (error) {
                res.redirect("/auth/login")
            }
            if (data) {
                for (let index = 0; index < data.length; index++) {
                    row = data[index];
                    t = new Task(row[0], userID, row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8])
                    // `SELECT t.task_id, t.title, t.description, t.status, t.start_time, t.end_time, t.due_date, t.priority, t.location
                    tags = Task.getTagsByTaskID(t.task_id)
                    tags.forEach(row => {
                        t.tags.push(row[2])
                    });
                    result.push(t);
                }
                username = User.getUserProfile(userID)
                // res.render("pages/dashboard")
                res.render("pages/dashboard", { "data": result, "userID": userID, "name": username })
            }
        })
    } catch (error) {
        res.redirect("auth/login")
    }
})

router.get("/tasks", (req, res) => {
    userID = req.session.userID
    console.log(userID)
    try {
        // access tasks based on email
        result = [];
        tasks = Task.getAllTasksWithTagsByUser(1, (error, data) => {
            if (error) {
                res.redirect("/auth/login")
            }
            if (data) {
                for (let index = 0; index < data.length; index++) {
                    row = data[index];
                    t = new Task(row[0], 1, row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8])
                    // `SELECT t.task_id, t.title, t.description, t.status, t.start_time, t.end_time, t.due_date, t.priority, t.location
                    tags = Task.getTagsByTaskID(t.task_id)
                    tags.forEach(row => {
                        t.tags.push(row[2])
                    });
                    result.push(t);
                }
                username = User.getUserProfile(1)
                res.send(result)
            }
        })
    } catch (error) {
        console.log("Error: " + error)
        res.send({ "Error": "Error accessing tasks" })
    }
})

router.post("/create", (req, res) => {

    const { user_id, title, category, due_date, priority, start_time, end_time, description, location, status } = req.body

    try {
        const task = addTask(user_id, title, category, due_date, priority, start_time, end_time, description, location, status)
        res.status(202).json({ task_id: task.task_id })
    } catch (err) {
        res.status(500).json({ err: "Error adding task" })
    }
})

router.put("/edit/:id", (req, res) => {
    task_id = req.params.id
    const { user_id, title, category, due_date, priority, start_time, end_time, description, location, status } = req.body

})

module.exports = router