const  express = require('express')
const db = require('../db')
const bcrypt = require('bcrypt')
const router = express.Router()
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET

// API Login
router.post('/login',async (req,res) => {
    try{
        const {username,password,role} = req.body
        const [rows] = await db.query(`select * from tb_member where username=? and role=?`,[username,role])
        const m = rows[0]
        if(!password || !(await bcrypt.compare(password,m.password))) return res.status(403).json({message:'Invalid Password!'})
        const token = jwt.sign(
            {id_member:m.id_member,username:m.username,role:m.role} , JWT_SECRET , {expiresIn:'2h'}
        )
        res.json({token,role:m.role})
    }catch(err){
        console.error("Error Login",err)
        res.status(500).json({message:'Error Login'})
    }
})

// API Register
router.post('/regis',async (req,res) => {
    try{
        const {first_name,last_name,email,username,password,role} = req.body
        const hash = await bcrypt.hash(password,10)
        const [rows] = await db.query(`insert into tb_member (first_name,last_name,email,username,password,role) values (?,?,?,?,?,?)`,[first_name,last_name,email,username,hash,role])
        res.json({rows,message:'Register Success!'})
    }catch(err){
        console.error("Error Register",err)
        res.status(500).json({message:'Error Register'})
    }
})

module.exports = router