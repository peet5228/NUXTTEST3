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
router.get('/header/:id_eva',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try{
        const {id_eva} = req.params
        const [rows] = await db.query(`select * from tb_eva , tb_member , tb_system where tb_eva.id_eva='${id_eva}' and tb_eva.id_member=tb_member.id_member and tb_system.id_sys=tb_eva.id_sys `)
        res.json(rows)
        // res.json({rows,message:''})
    }catch(err){
        console.error("Error Get",err)
        res.status(500).json({message:'Error Get'})
    }
})

// API สำหรับ Get ข้อมูล
router.get('/:id_eva',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try{
        const {id_eva} = req.params
        const [before] = await db.query(`select id_member,concat(first_name,' ',last_name)as fullname_commit from tb_member where role='กรรมการประเมิน' order by id_member desc`)
        const [after] = await db.query(`select id_commit,tb_member.id_member , first_name,last_name,level_commit as role from tb_commit,tb_member,tb_eva where tb_commit.id_eva='${id_eva}' and tb_eva.id_eva=tb_commit.id_eva and tb_commit.id_member=tb_member.id_member`)
        res.json({after,before})
        // res.json({rows,message:''})
    }catch(err){
        console.error("Error Get",err)
        res.status(500).json({message:'Error Get'})
    }
})

// API สำหรับ Insert ข้อมูล
router.post('/:id_eva',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try{
        const {id_eva} = req.params
        await db.query(`delete from tb_commit where id_eva='${id_eva}'`)
        const m = req.body
        const v = m.map(p=> [id_eva,p.id_member,p.role,'n'])
        await db.query(`insert into tb_commit (id_eva,id_member,level_commit,status_commit) values ?`,[v])
        // const [rows] = await db.query(``)
        // res.json(rows)
        res.json({message:'Insert Success'})
    }catch(err){
        console.error("Error Insert",err)
        res.status(500).json({message:'Error Insert'})
    }
})

// API สำหรับ Delete ข้อมูล
router.delete('/:id_commit',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try{
        const {id_commit} = req.params
        const [rows] = await db.query(`delete from tb_commit where id_commit='${id_commit}'`)
        // res.json(rows)
        res.json({rows,message:'Delete Success'})
    }catch(err){
        console.error("Error Delete",err)
        res.status(500).json({message:'Error Delete'})
    }
})

module.exports = router