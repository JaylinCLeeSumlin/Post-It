var express = require("express")

var router = express.Router()

// slash corresponds to slash that comes AFTER route stated in app.js
router.post("/task/create", (req, res) => {
    
    const { user_id, title, category, due_date, priority } = req.body

    try{
        const task = addTask(user_id, title, category, due_date, priority, start_time, end_time, description, location, status)
        res.status(202).json({ task_id: task.task_id })
    } catch (err) {
        res.status(500).json({ err: "Error adding task"})
    }
})

module.exports = router