var express = require("express")

var router = express.Router()

let users = new Map();

// slash corresponds to slash that comes AFTER route stated in app.ja
router.get("/", (req, res) => {
    
    auth_form =`
        <form action="/auth" method="POST">
            <input type="text" name="username" placeholder="Type your username">
            <br>
            <input type="text" name="password">
            <input type="submit" name="submitBtn">
        </form>
    `
    
    res.send(auth_form)
})

router.post("/", (req, res) => {   
    
    // access post variables
    let userName = req.body.username
    let password = req.body.password

    // create fake accounts for testing
    userName = "admin"
    password = "password"
    userId = Math.floor(Math.random() * 10000) + 1
    users.set(userName, password, userID)
    console.log(users)

    if (users.has(userName) && users.get(userName)==password){
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