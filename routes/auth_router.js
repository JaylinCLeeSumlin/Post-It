var crypto = require("crypto")
var express = require("express")
var router = express.Router()
const Task = require("../database/Task")
const User = require("../database/User")

router.get("/signup", (req, res) => {

    // Check if user is authenticated - user session variable

    if (req.session.isValidUser) {
        res.render("pages/dashboard")
    } else {
        res.render("pages/registration", {msg:undefined})
    }
})

router.post("/signup", (req, res) => {
    
    const { name, email, password , reqPassword} = req.body
    
    if (password != reqPassword) {
        res.status(400).json({ err: "Passwords to not match"})
    }

    try{
        // encrypt password
        password_hash = crypto.createHash("md5").update(password).digest("hex")

        // if (email && password) {
        //     // dbUtil.userDOA.lookupUperByEmail(email, (err, data, arg) => {
        //         if (err) {
        //             res.send("Error:", err)
        //         } else if (!data) {
        //             res.send("Authentication failed")
        //             // res.redirect()
        //         } else {
        //             console.log("Authentication successful")
        //         }
        //     })
        // }
        var User = require("../database/User")
        const user = new User(null, email, password_hash,name)
        user.addUser((data)=> {
            // res.status(202).json({ user_id: user.user_id })
            msg = undefined
            if (data.code == 501){
                res.render("pages/registration",{msg:data.err})
            }else if(data.code ==100){
                res.render("pages/login", {msg:"Account Created Successfuly!"})
            }else{
                msg = "Registration Failed!"
                res.render("pages/registration",{msg:msg})
            }

        })
    } catch (err) {
        console.log(err)
        // res.status(500).json({ err: "Error adding user"})
        // res.render("pages/registration",{msg:err})
    }
})

router.get("/login", (req, res) => {

    // Check if user is authenticated - user session variable

   //const { email, password } = req.body

   // password = crypto.createHash("md5").update(password).digest("hex")
    if (req.session.isValidUser ) {
        res.render("pages/dashboard")
    } else {
        res.render("pages/login",{msg:undefined})
    }
})


router.post("/login", (req, res) => {   
    
    // access post variables
    let email = req.body.email
    let password = req.body.password

    console.log("Email:"+email)

    try {
        User.authenticate(email, password, (data)=>{
            if(data.err){
                msg = undefined
                req.session.isValidUser = false
                res.render("pages/login",{msg:"Invalid user name or password "})
        
            }else if(data.token){
                req.session.isValidUser = true
                req.session.email = email
                req.session.userID = User.user_id
                res.redirect("/user/dashboard")
            }
        })
        
        
    } catch {
        req.session.isValidUser = false
        res.redirect("pages/login")
    }
    
   
})

module.exports = router