var express = require("express")
var router = express.Router()

const { addUser, getTasksByUser } = require("../database/dbcon")


// slash corresponds to slash that comes AFTER route stated in app.ja
router.post("/signup", (req, res) => {
    
    const { name, email, password , reqPassword} = req.body
    
    if (password != reqPassword) {
        res.status(400).json({ err: "Passwords to not match"})
    }

    try{
        const user = addUser(name, email, password)
        res.status(202).json({ user_id: user.user_id })
    } catch (err) {
        res.status(500).json({ err: "Error adding user"})
    }
})

router.get("/dashboard", (req, res) => {   
    
    // access post variables
    
    if (req.session.isValidUser) {
        // get front-end requirements from db, put in to json object
        data = getTasksByUser(req.session.user_id)
        res.render("pages/dashboard", { user_data: data})
    } else {
        res.redirect("/auth/login")
    }
})

router.get("/calendar",(req,res)=>{
    
    res.render("pages/calendar")
})

router.get('/dashboard2',(req,res)=>{
    res.render("pages/dashboard")
})

router.get('/messager',(req,res)=>{
    res.render("pages/messager")
})
router.get('/profile',(req,res)=>{
    res.render('secure/profile')
})
/*
views/partial
sessions
security (has libraries available - jwt,)

*/

module.exports = router