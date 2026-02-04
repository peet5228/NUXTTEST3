const  express = require('express')
const db = require('../../db')
const router = express.Router()
const {verifyToken,requireRole} = require('../../middleware/authMiddleware')
const path = require('path')
const uploadDir = path.join(__dirname,'../../uploads/evadetail')

// API User
router.get('/user',verifyToken,requireRole('ผู้รับการประเมินผล'),async (req,res) => {
    try{
        const id_member = req.user.id_member
        const [rows] = await db.query(`select * from tb_member m,tb_eva e,tb_system s where m.id_member=? and m.id_member=e.id_member and e.id_sys=s.id_sys order by e.id_eva desc`,
            [id_member]
        )
        res.json(rows[0])
    }catch(err){
        console.error("Error GET User!",err)
        res.status(500).json({message:'Error GET User!'})
    }
})

router.get('/topic',verifyToken,requireRole('ผู้รับการประเมินผล'),async (req,res) => {
    try{
        const id_member = req.user.id_member
        const [topics] = await db.query(`select * from tb_topic`)
        const [indicates] = await db.query(`select * from tb_indicate`)
        const result = topics.map(t =>({
            ...t,
            indicates:indicates.filter((i) => i.id_topic === t.id_topic)
        }))
        res.json(result)
    }catch(err){
        console.error("Error GET User!",err)
        res.status(500).json({message:'Error GET User!'})
    }
})

router.post('/save',verifyToken,requireRole('ผู้รับการประเมินผล'),async (req,res) => {
    try{
        const id_member = req.user.id_member
        const scores = JSON.parse(req.body.scores)
        const fileMap = {}
        await Promise.all(Object.entries(req.files).map(async ([key,file]) =>{
            const filename = Date.now()+Math.random().toString(36).slice(2)+path.extname(file.name)
            await file.mv(path.join(uploadDir,filename))
            fileMap[key] = filename
        }))
        const [[evaRow]] = await db.query(`select * from tb_member m,tb_eva e,tb_system s where m.id_member=? and m.id_member=e.id_member and e.id_sys=s.id_sys order by e.id_eva desc`,
            [id_member]
        )
        const id_eva = evaRow.id_eva
        for(const item of scores){
            const filename = fileMap[item.file_key]
            await db.query(
                `insert into tb_evadetail (id_eva,id_indicate,status_eva,score_member,detail_eva,file_eva) values(?,?,?,?,?,?)`,
                [id_eva,item.id_indicate,1,item.score,item.detail_eva,filename]
            )
        }
        const [[sumRow]] = await db.query(
            `select coalesce(sum(score_member*(select i.point_indicate from tb_indicate i where i.id_indicate=d.id_indicate)),0) as total
            from tb_evadetail d where d.id_eva=?`,[id_eva]
        )
        await db.query(`update tb_eva set total_eva=?,status_eva=? where id_eva=?`,[sumRow.total,2,id_eva])
        res.json({message:'post success'})
    }catch(err){
        console.error("Error GET User!",err)
        res.status(500).json({message:'Error GET User!'})
    }
})

module.exports = router