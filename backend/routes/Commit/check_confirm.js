const  express = require('express')
const db = require('../../db')
const router = express.Router()
const {verifyToken,requireRole} = require('../../middleware/authMiddleware')

// API User
router.get('/',verifyToken,requireRole('กรรมการประเมิน'),async (req,res) => {
    try{
        const id_member = req.user.id_member
        const [rows] = await db.query(`select * from tb_member m,tb_eva e,tb_system s,tb_commit c where c.id_member=? and e.status_eva in (2) and c.status_commit=? and c.id_eva=e.id_eva and c.id_member=m.id_member and e.id_sys=s.id_sys order by e.id_eva desc`,
            [id_member,'y']
        )
        res.json(rows)
    }catch(err){
        console.error("Error GET User!",err)
        res.status(500).json({message:'Error GET User!'})
    }
})

module.exports = router