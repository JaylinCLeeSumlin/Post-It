var express = require("express")
var router = express.Router()

const { addUser } = require("../database/dbcon")


// slash corresponds to slash that comes AFTER route stated in app.ja
router.post("/user", (req, res) => {
    
    const { name, email, password } = req.body
    
    try{
        const user = addUser(name, email, password)
        res.json({ user_id: user.user_id })
    } catch (err) {
        res.status(500).json({ err: "Error adding user"})
    }
})

router.post("/", (req, res) => {   
    
    // access post variables
    let userName = req.body.username
    let password = req.body.password

    if (userName == "admin" && password=="password"){
        req.session.isValidUser = true
        req.session.userName = userName
        res.send("Welcome " + userName)
        // res.redirect("/user/profile")
    }else{
        req.session.isValidUser = false
        res.redirect("/auth")
    }
    
    res.send("Got it!")
})


/*
views/partial
sessions
security (has libraries available - jwt,)

*/

module.exports = router