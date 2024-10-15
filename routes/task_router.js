var express = require("express")

var router = express.Router()

// slash corresponds to slash that comes AFTER route stated in app.js
router.get("/", (req, res) => {
    
    res.send("Enter a task")
})

module.exports = router