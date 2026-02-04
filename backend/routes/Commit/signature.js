const  express = require('express')
const  path = require('path')
const fs = require('fs')
const uploadDir = path.join(__dirname,'../../uploads/signature')
const db = require('../../db')
const bcrypt = require('bcrypt')
const router = express.Router()
const {verifyToken,requireRole} = require('../../middleware/authMiddleware')

// API สำหรับ Get ข้อมูล
router.get('/:id_eva',verifyToken,requireRole('กรรมการประเมิน'),async (req,res) => {
    try{
        const id_member = req.user.id_member
        const id_eva = req.params.id_eva
        const [rows] = await db.query(`select * from tb_commit where id_eva=? and id_member=?`,[id_eva,id_member])
        res.json(rows[0])
        // res.json({rows,message:''})
    }catch(err){
        console.error("Error Get",err)
        res.status(500).json({message:'Error Get'})
    }
})


// API สำหรับ Uploads ข้อมูล
router.post('/:id_eva',verifyToken,requireRole('กรรมการประเมิน'),async (req,res) => {
    try{
        const id_member = req.user.id_member
        const id_eva = req.params.id_eva
        const file = req.files?.file
        const maxSize = 10*1024*1024
        if(file.size > maxSize) return res.status(400).json({message:'ขนาดไฟล์ใหญ่กว่าที่กำหนดไว้ 10 MB'})
        const filename = Date.now() + path.extname(file.name).toLowerCase()
        await file.mv(path.join(uploadDir,filename))
        await db.query(`update tb_commit set signature=? where id_eva=? and id_member=?`,[filename,id_eva,id_member])
        // res.json(rows)
        res.status(201).json({message:'Upload Success'})
    }catch(err){
        console.error("Error Upload",err)
        res.status(500).json({message:'Error Upload'})
    }
})

// API สำหรับ Get ข้อมูล
router.delete('/:id_eva',verifyToken,requireRole('กรรมการประเมิน'),async (req,res) => {
    try{
        const id_member = req.user.id_member
        const id_eva = req.params.id_eva
        const [[d]] = await db.query(`select signature from tb_commit where id_eva=? and id_member=?`,[id_eva,id_member])
        const fp = path.join(uploadDir,d.signature)
        if(fs.existsSync(fp)){
            fs.unlinkSync(fp)
        }
        await db.query(`update tb_commit set signature=? where id_eva=? and id_member=?`,[null,id_eva,id_member])
        res.json({message:'Success'})
        // res.json({rows,message:''})
    }catch(err){
        console.error("Error delete",err)
        res.status(500).json({message:'Error delete'})
    }
})

module.exports = router