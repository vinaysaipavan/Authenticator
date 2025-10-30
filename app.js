const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const path = require("path");
const userModel = require("./models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
require('dotenv').config();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.render("index");
});

app.post("/create", async (req, res) => {
    let { username, email, password, age } = req.body;
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            let createduser = await userModel.create({
                username,
                email,
                originalpass:password,
                password: hash,
                age,
            });
            let token =  jwt.sign({email},process.env.JWT_SECRET);
            res.cookie("Token",token)
            res.send(createduser);
        });
    });
});

app.get("/logout",(req,res)=>{
    res.cookie("Token","");
    res.redirect("/");
})

app.get("/login",(req,res)=>{
    res.render('login');
})

app.post("/login",async(req,res)=>{
    let user = await userModel.findOne({email:req.body.email})
    if(!user){
        return res.status(400).send("Invalid email or password");
    }
    bcrypt.compare(req.body.password,user.password,(err,result)=>{
        if(result){
            res.status(200).send("You are the real user",user);
        }else{
            res.send("passwrod is incorrect");
        }
    })
})

app.listen(3000, () => {
    console.log("App is listened at 3000");
});
