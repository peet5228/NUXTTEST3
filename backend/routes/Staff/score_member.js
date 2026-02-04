const  express = require('express')
const db = require('../../db')
const router = express.Router()
const {verifyToken,requireRole} = require('../../middleware/authMiddleware')
const path = require('path')
const uploadDir = path.join(__dirname,'../../uploads/evadetail')

// API User
router.get('/user/:id_eva',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try{
        const {id_eva} = req.params
        const id_member = req.user.id_member
        const [rows] = await db.query(`select * from tb_member m,tb_eva e,tb_system s where e.id_eva=? and m.id_member=e.id_member and e.id_sys=s.id_sys order by e.id_eva desc`,
            [id_eva]
        )
        res.json(rows[0])
    }catch(err){
        console.error("Error GET User!",err)
        res.status(500).json({message:'Error GET User!'})
    }
})

router.get('/topic/:id_eva',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try{
        const {id_eva} = req.params
        const [[evaRow]] = await db.query(`select * from tb_member m,tb_eva e,tb_system s where e.id_eva=? and m.id_member=e.id_member and e.id_sys=s.id_sys order by e.id_eva desc`,
            [id_eva]
        )
        // const id_eva = evaRow.id_eva
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

module.exports = router