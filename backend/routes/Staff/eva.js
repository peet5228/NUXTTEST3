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
        const [rows] = await db.query(`select * from tb_member , tb_eva , tb_system where tb_eva.id_member=tb_member.id_member and tb_eva.id_sys=tb_system.id_sys and status_eva=1 order by id_eva desc`)
        res.json(rows)
        // res.json({rows,message:''})
    }catch(err){
        console.error("Error Get",err)
        res.status(500).json({message:'Error Get'})
    }
})

// API สำหรับ Get ข้อมูล where params
router.get('/:id_eva',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try{
        const {id_eva} = req.params
        const [rows] = await db.query(`select * from tb_member , tb_eva , tb_system where tb_eva.id_eva='${id_eva}' and tb_eva.id_member=tb_member.id_member and tb_eva.id_sys=tb_system.id_sys order by id_eva desc`)
        if(rows.length === 0) return res.status(403).json({message:'Invalid Params'})
        res.json(rows)
        // res.json({rows,message:''})
    }catch(err){
        console.error("Error Get",err)
        res.status(500).json({message:'Error Get'})
    }
})

// API สำหรับ Get ข้อมูล
router.get('/all',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try{
        const [rows] = await db.query(`select * from tb_member , tb_eva , tb_system where tb_eva.id_member=tb_member.id_member and tb_eva.id_sys=tb_system.id_sys order by id_eva desc`)
        res.json(rows)
        // res.json({rows,message:''})
    }catch(err){
        console.error("Error Get",err)
        res.status(500).json({message:'Error Get'})
    }
})

// API สำหรับ Get ข้อมูล
router.get('/y',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try{
        const [rows] = await db.query(`select * from tb_member , tb_eva , tb_system where tb_eva.id_member=tb_member.id_member and tb_eva.id_sys=tb_system.id_sys and status_eva=3 order by id_eva desc`)
        res.json(rows)
        // res.json({rows,message:''})
    }catch(err){
        console.error("Error Get",err)
        res.status(500).json({message:'Error Get'})
    }
})

// API สำหรับ Get ข้อมูล
router.get('/n',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try{
        const [rows] = await db.query(`select * from tb_member , tb_eva , tb_system where tb_eva.id_member=tb_member.id_member and tb_eva.id_sys=tb_system.id_sys and status_eva!=3 order by id_eva desc`)
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
        const {id_member,id_sys,day_eva} = req.body
        const [rows] = await db.query(`insert into tb_eva (id_member,id_sys,day_eva,status_eva) values (?,?,?,?)`,[id_member,id_sys,day_eva,1])
        // res.json(rows)
        res.json({rows,message:'Insert Success'})
    }catch(err){
        console.error("Error Insert",err)
        res.status(500).json({message:'Error Insert'})
    }
})

// API สำหรับ Update ข้อมูล
router.put('/:id_eva',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try{
        const {id_eva} = req.params
        const {id_member,id_sys,day_eva} = req.body
        const [rows] = await db.query(`update tb_eva set id_member=?,id_sys=?,day_eva=?,status_eva=? where id_eva='${id_eva}'`,[id_member,id_sys,day_eva,1])
        // res.json(rows)
        res.json({rows,message:'Update Success'})
    }catch(err){
        console.error("Error Update",err)
        res.status(500).json({message:'Error Update'})
    }
})

// API สำหรับ Delete ข้อมูล
router.delete('/:id_eva',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try{
        const {id_eva} = req.params
        const [rows] = await db.query(`delete from tb_eva where id_eva='${id_eva}'`)
        // res.json(rows)
        res.json({rows,message:'Delete Success'})
    }catch(err){
        console.error("Error Delete",err)
        res.status(500).json({message:'Error Delete'})
    }
})

module.exports = router
