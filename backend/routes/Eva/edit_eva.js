const  express = require('express')
const db = require('../../db')
const router = express.Router()
const {verifyToken,requireRole} = require('../../middleware/authMiddleware')
const bcrypt = require('bcrypt')

// API get
router.get('/',verifyToken,requireRole('ผู้รับการประเมินผล'),async (req,res) => {
    try{
        const id_member = req.user.id_member
        const [rows] = await db.query(`select first_name,last_name,email,username,role from tb_member where id_member=?`,[id_member])
        res.json(rows[0])
    }catch(err){
        console.error("Error GET Profile!",err)
        res.status(500).json({message:'Error GET Profile!'})
    }
})

// API put 
router.put('/',verifyToken,requireRole('ผู้รับการประเมินผล'),async (req,res) => {
    try{
        const id_member = req.user.id_member
        const {first_name,last_name,email,username,password} = req.body
        if(password && password.trim()){
            const hash = await bcrypt.hash(password,10)
            await db.query(`update tb_member set first_name=?,last_name=?,email=?,username=?,password=? where id_member='${id_member}'`,[first_name,last_name,email,username,hash])
        }else{
            await db.query(`update tb_member set first_name=?,last_name=?,email=?,username=? where id_member='${id_member}'`,[first_name,last_name,email,username])
        }
        res.json({message:'Update Success'})
        // res.json({rows,message:''})
    }catch(err){
        console.error("Error Update",err)
        res.status(500).json({message:'Error Update'})
    }
})

module.exports = router