const  express = require('express')
const db = require('../../db')
const router = express.Router()
const {verifyToken,requireRole} = require('../../middleware/authMiddleware')

// API Register
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

module.exports = router