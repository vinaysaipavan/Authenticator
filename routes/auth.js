const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const router = express.Router();

router.post('/login' , async(res,req)=>{
    const {name,email,password} = req.body;
    try{
        const user = await pool.query("SELECT * FROM users WHERE email = $1",[email]);
        if(user.rows.length === 0){
            return res.status(400).json({msg:"User not found!"});
        }

        const isMatch = await bcrypt.compare(password,user.rows[0].password);
        if(!isMatch){
            return res.status(401).json({msg:"Invalid password!"});
        }
    }
})