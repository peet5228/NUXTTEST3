const  express = require('express')
const  path = require('path')
const fs = require('fs')
const uploadDir = path.join(__dirname,'../../uploads/document')
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
        const [rows] = await db.query(`select * from tb_doc order by id_doc desc`)
        res.json(rows)
        // res.json({rows,message:''})
    }catch(err){
        console.error("Error Get",err)
        res.status(500).json({message:'Error Get'})
    }
})


// API สำหรับ Uploads ข้อมูล
router.post('/',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try{
        const {name_doc} = req.body
        const file = req.files?.file
        const maxSize = 10*1024*1024
        if(file.size > maxSize) return res.status(400).json({message:'ขนาดไฟล์ใหญ่กว่าที่กำหนดไว้ 10 MB'})
        const filename = Date.now() + path.extname(file.name).toLowerCase()
        await file.mv(path.join(uploadDir,filename))
        await db.query(`insert into tb_doc (name_doc,day_doc,file) values (?,CURDATE(),?)`,[name_doc,filename])
        // res.json(rows)
        res.status(201).json({message:'Upload Success'})
    }catch(err){
        console.error("Error Upload",err)
        res.status(500).json({message:'Error Upload'})
    }
})

// API สำหรับ Get ข้อมูล
router.delete('/:id_doc',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try{
        const {id_doc} = req.params
        const [[d]] = await db.query(`select file from tb_doc where id_doc='${id_doc}'`)
        const fp = path.join(uploadDir,d.file)
        if(fs.existsSync(fp)){
            fs.unlinkSync(fp)
        }
        await db.query(`delete from tb_doc where id_doc='${id_doc}'`)
        res.json({message:'Success'})
        // res.json({rows,message:''})
    }catch(err){
        console.error("Error delete",err)
        res.status(500).json({message:'Error delete'})
    }
})

module.exports = router