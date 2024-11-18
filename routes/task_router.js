var express = require("express")

var router = express.Router()

router.post("/create", (req, res) => {
    
    const { user_id, title, category, due_date, priority, start_time, end_time, description, location, status } = req.body

    try{
        const task = addTask(user_id, title, category, due_date, priority, start_time, end_time, description, location, status)
        res.status(202).json({ task_id: task.task_id })
    } catch (err) {
        res.status(500).json({ err: "Error adding task"})
    }
})

router.put("/edit/:id", (req, res) => {
    task_id = req.params.id
    const { user_id, title, category, due_date, priority, start_time, end_time, description, location, status } = req.body

})

module.exports = router