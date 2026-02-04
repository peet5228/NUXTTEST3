const  express = require('express')
const db = require('../db')
const bcrypt = require('bcrypt')
const router = express.Router()
const {verifyToken,requireRole} = require('../middleware/authMiddleware')

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
router.get('/staff',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try{
        const [[evaCount]] = await db.query(`select count(*)as total from tb_eva`)
        const [[one]] = await db.query(`select count(*)as total from tb_eva where status_eva!=3`)
        const [[two]] = await db.query(`select count(*)as total from tb_eva where status_eva=3`)
        const [[eva]] = await db.query(`select count(*)as total from tb_member where role='ผู้รับการประเมินผล'`)
        const [[commit]] = await db.query(`select count(*)as total from tb_member where role='กรรมการประเมิน'`)

        res.json({
            box : [
                {tile:'แบบประเมินทั้งหมด',value:evaCount.total || '0' },
                {tile:'แบบประเมินที่ไม่สำเร็จ',value:evaCount.total > 0 ? ` ${ (one.total*100/evaCount.total).toFixed(2) }%` : '00.00%' },
                {tile:'แบบประเมินที่สำเร็จ',value:evaCount.total > 0 ? ` ${ (two.total*100/evaCount.total).toFixed(2) }%` : '00.00%' },
            ],
            box2 : [
                {tile:'ผู้รับการประเมินผลทั้งหมด',value:eva.total || '0' },
                {tile:'กรรมการประเมินผลทั้งหมด',value:commit.total || '0' },
            ]
        })
        // res.json({rows,message:''})
    }catch(err){
        console.error("Error Get",err)
        res.status(500).json({message:'Error Get'})
    }
})

// API สำหรับ Get ข้อมูล
router.get('/eva',verifyToken,requireRole('ผู้รับการประเมิน'),async (req,res) => {
    try{
    const id_member = req.user.id_member
        const [[evaCount]] = await db.query(`select count(*) as total from tb_eva,tb_member where tb_member.id_member='${id_member}' and tb_eva.id_member=tb_member.id_member`)
        const [[one]] = await db.query(`select count(*) as total from tb_eva,tb_member where tb_member.id_member='${id_member}' and tb_eva.id_member=tb_member.id_member and status_eva=1`)
        const [[two]] = await db.query(`select count(*) as total from tb_eva,tb_member where tb_member.id_member='${id_member}' and tb_eva.id_member=tb_member.id_member and status_eva!=1`)
        res.json({
            box : [
                {title:'แบบประเมินทั้งหมด',value:eva}
            ]
        })
        // res.json({rows,message:''})
    }catch(err){
        console.error("Error Get",err)
        res.status(500).json({message:'Error Get'})
    }
})

module.exports = router
