const  express = require('express')
const db = require('../../db')
const bcrypt = require('bcrypt')
const router = express.Router()
const {verifyToken,requireRole} = require('../../middleware/authMiddleware')


// ===== DEMO =====
// API สำหรับ Get ข้อมูล
// router.get('/',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
//     try{
//         const [rows] = await db.query(``)
//         res.json(rows)
//         // res.json({rows,message:''})
//     }catch(err){
//         console.error("Error Get",err)
//         res.status(500).json({message:'Error Get'})
//     }
// })
// ===== DEMO =====

// API สำหรับ Get ข้อมูล
router.get('/',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try{
        const [rows] = await db.query(`select * from tb_indicate,tb_topic where tb_indicate.id_topic=tb_topic.id_topic order by id_indicate desc`)
        res.json(rows)
        // res.json({rows,message:''})
    }catch(err){
        console.error("Error Get",err)
        res.status(500).json({message:'Error Get'})
    }
})

// API สำหรับ Get ข้อมูล where params
router.get('/:id_indicate',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try{
        const {id_indicate} = req.params
        const [rows] = await db.query(`select * from tb_indicate where id_indicate='$${id_indicate}' order by id_indicate desc`)
        if(rows.length === 0) return res.status(403).json({message:'Invalid Params'})
        res.json(rows)
        // res.json({rows,message:''})
    }catch(err){
        console.error("Error Get",err)
        res.status(500).json({message:'Error Get'})
    }
})

// API สำหรับ Insert ข้อมูล
router.post('/',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try{
        const {id_topic,name_indicate,datail_indicate,point_indicate,check_indicate} = req.body
        const [rows] = await db.query(`insert into tb_indicate (id_topic,name_indicate,datail_indicate,point_indicate,check_indicate) values (?,?,?,?,?)`,[id_topic,name_indicate,datail_indicate,point_indicate,check_indicate])
        // res.json(rows)
        res.json({rows,message:'Insert Success!'})
    }catch(err){
        console.error("Error Insert",err)
        res.status(500).json({message:'Error Insert'})
    }
})

module.exports = router
