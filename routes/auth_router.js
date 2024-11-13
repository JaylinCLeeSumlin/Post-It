var crypto = require("crypto")
var express = require("express")
var router = express.Router()

router.get("/signup", (req, res) => {

    // Check if user is authenticated - user session variable

    if (req.session.isValidUser) {
        res.render("pages/dashboard")
    } else {
        res.render("pages/registration")
    }
})

router.post("/signup", (req, res) => {
    
    const { name, email, password , reqPassword} = req.body
    
    if (password != reqPassword) {
        res.status(400).json({ err: "Passwords to not match"})
    }

    try{
        // encrypt password
        password = crypto.createHash("md5").update(password).digest("hex")

        if (email && password) {
            dbUtil.userDOA.lookupUperByEmail(email, (err, data, arg) => {
                if (err) {
                    res.send("Error:", err)
                } else if (!data) {
                    res.send("Authentication failed")
                    // res.redirect()
                } else {
                    console.log("Authentication successful")
                }
            })
        }
        const user = addUser(name, email, password)
        res.status(202).json({ user_id: user.user_id })
    } catch (err) {
        res.status(500).json({ err: "Error adding user"})
    }
})

router.get("/login", (req, res) => {

    // Check if user is authenticated - user session variable

   //const { email, password } = req.body

   // password = crypto.createHash("md5").update(password).digest("hex")
    if (req.session.isValidUser ) {
        res.render("pages/dashboard")
    } else {
        res.render("pages/login")
    }
})


router.post("/login", (req, res) => {   
    
    // access post variables
    let userName = req.body.username
    let password = req.body.password

    console.log("Username:"+userName)
    if (userName == "admin" && password=="password"){
        req.session.isValidUser = true
        req.session.userName = userName
        res.send("Welcome " + userName)
        // res.redirect("/user/profile")
    }else{
        req.session.isValidUser = false
        res.redirect("/auth/login")
    }
    
   
})

module.exports = router