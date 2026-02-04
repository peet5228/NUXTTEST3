const  express = require('express')
const db = require('../../db')
const router = express.Router()
const {verifyToken,requireRole} = require('../../middleware/authMiddleware')
const path = require('path')
const uploadDir = path.join(__dirname,'../../uploads/evadetail')

// API User
router.get('/user/:id_eva',verifyToken,requireRole('กรรมการประเมิน'),async (req,res) => {
    try{
        const id_member = req.user.id_member
        const id_eva = req.params.id_eva
        const [rows] = await db.query(`select * from tb_member m,tb_eva e,tb_system s,tb_commit c where c.id_member=? and c.id_eva=? and c.id_eva=e.id_eva and c.id_member=m.id_member and e.id_sys=s.id_sys order by e.id_eva desc`,
                    [id_member,id_eva]
                )
        res.json(rows[0])
    }catch(err){
        console.error("Error GET User!",err)
        res.status(500).json({message:'Error GET User!'})
    }
})

router.get('/topic/:id_eva',verifyToken,requireRole('กรรมการประเมิน'),async (req,res) => {
    try{
        const id_member = req.user.id_member
        const id_eva = req.params.id_eva
        const [topics] = await db.query(`select * from tb_topic`)
        const [indicates] = await db.query(`select * from tb_indicate i,tb_evadetail d where i.id_indicate=d.id_indicate and d.status_eva=? and d.id_eva=?`,[1,id_eva])
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

router.post('/save/:id_eva',verifyToken,requireRole('กรรมการประเมิน'),async (req,res) => {
    try{
        const id_member = req.user.id_member
        const scores = JSON.parse(req.body.scores)
        const detail_commit = req.body.detail_commit
        const id_eva = req.params.id_eva
        const [[COMMIT]] = await db.query(`select * from tb_commit where id_eva=? and id_member=?`,[id_eva,id_member])
        var statusC = 0
        if(COMMIT.level_commit === 'ประธาน'){
            statusC = 2
        }else if(COMMIT.level_commit === 'กรรมการ'){
            statusC = 3
        }else if(COMMIT.level_commit === 'เลขา'){
            statusC = 4
        }
        for(const item of scores){
            await db.query(
                `insert into tb_evadetail (id_eva,id_indicate,status_eva,score_commit) values(?,?,?,?)`,
                [id_eva,item.id_indicate,statusC,item.score]
            )
        }
        const [[sumRow]] = await db.query(
            `select coalesce(sum(score_commit*(select i.point_indicate from tb_indicate i where i.id_indicate=d.id_indicate)),0) as total
            from tb_evadetail d where d.id_eva=?`,[id_eva]
        )
        await db.query(`update tb_eva set total_commit=? where id_eva=?`,[sumRow.total,id_eva])
        await db.query(`update tb_commit set detail_commit=?,status_commit=? where id_eva=? and id_member=?`,[detail_commit,'y',id_eva,id_member])
        const [COMMITS] = await db.query(`select * from tb_commit where id_eva=? and status_commit=?`,[id_eva,'y'])
        if(COMMITS.length === 3){
            await db.query(`update tb_eva set status_eva=? where id_eva=?`,[3,id_eva])
        }
        res.json({message:'post success'})
    }catch(err){
        console.error("Error GET User!",err)
        res.status(500).json({message:'Error GET User!'})
    }
})

module.exports = router