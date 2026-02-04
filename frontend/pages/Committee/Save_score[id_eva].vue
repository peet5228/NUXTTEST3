<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-form v-if="user.status_commit === 'n'" @submit.prevent="saveScore">
                    <h1 class="text-h5 font-weight-bold">แบบประเมินตนเอง</h1>
                    <v-card class="mt-2 pa-2">
                        <p>ชื่อ - นามสกุล : {{ user.first_name }} {{ user.last_name }}</p>
                        <p>รอบประเมินที่ : {{ user.round_sys }} ปี {{ user.year_sys }}</p>
                    </v-card>
                    <v-row class="mt-2" v-for="(topic,t) in topics" :key="topic.id_topic">
                        <v-col cols="12">
                            <h1 class="text-h6">{{ t+1 }}.{{ topic.name_topic }}</h1>
                            <v-card class="pa-2">
                                <v-row v-for="(indicate,i) in topic.indicates" :key="indicate.id_indicate">
                                    <v-col cols="12">
                                        <p>
                                            {{ t+1 }}.{{ i+1 }} {{ indicate.name_indicate }} รายละเอียดตัวชี้วัด : {{ indicate.detail_indicate }} น้ำหนักคะแนน : {{ indicate.point_indicate }} คะแนนเต็ม : {{ indicate.point_indicate*4 }}
                                        </p>
                                        <p class="mt-2">รายละเอียด : {{ indicate.detail_eva || '-' }}</p>
                                        <p class="mt-2">รายละเอียด : <v-btn v-if="indicate.file_eva" color="blue" size="small" @click="viweFile(indicate.file_eva)">ดูไฟล์</v-btn><span v-else>-</span></p>
                                        <v-select class="mt-2" label="ใส่คะแนนประเมิน 1-4" v-model="indicate.score" :items="[1,2,3,4]"></v-select>
                                    </v-col>
                                </v-row>
                            </v-card>
                        </v-col>
                    </v-row>
                    <div class="mt-4">
                        <v-card class="pa-2">
                            <label for="ข้อเสนอแนะ">ข้อเสนอแนะ</label>
                            <v-textarea label="(ถ้ามี)" v-model="detail_commit" rows="2"></v-textarea>
                        </v-card>
                    </div>
                    <div class="mt-4 text-center">
                        <br><v-btn type="submit" color="blue">บันทึกคะแนน</v-btn><br><br><br>
                    </div>
                </v-form>
                <v-alert v-else-if="user.status_commit === 'y'" type="success">ประเมินสำเร็จสำเร็จแล้ว</v-alert>
                <v-alert v-else type="warning">ยังไม่มีแบบประเมิน</v-alert>
            </v-col>
        </v-row>
        <v-snackbar v-model="notify.show" :color="notify.color" location="top" timeout="3000">
        {{ notify.text }}
        <template v-slot:actions>
            <v-btn variant="text" @click="notify.show = false">ปิด</v-btn>
        </template>
    </v-snackbar>
    </v-container>
</template>

<script setup lang="ts">
const user = ref<any>({})
const topics = ref<any>([])
import axios from 'axios'
import {commit} from '../../API/base'
const id_eva = useRoute().params.id_eva

// alert
// 1. สร้างตัวแปรเก็บสถานะ
const notify = reactive({ show: false, text: '', color: 'success' })

// 2. ฟังก์ชันเรียกใช้ (สั้นๆ)
const alertMsg = (text: string, isError = false) => {
    notify.text = text
    notify.color = isError ? 'warning' : 'success' // ถ้า Error สีแดง, ถ้าปกติ สีเขียว
    notify.show = true
}

const viweFile = (filename:string) =>{
    const url = `http://localhost:3001/uploads/evadetail/${filename}`
    window.open(url,"__blank")
}

const fetchUser = async () =>{
    const token = localStorage.getItem('token')
    try{
        const res = await axios.get(`${commit}/save_score/user/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        user.value = res.data
    }catch(err){
        console.error('Error GET User!',err)
    }
}
const fetchTopic = async () =>{
    const token = localStorage.getItem('token')
    try{
        const res = await axios.get(`${commit}/save_score/topic/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        topics.value = res.data
    }catch(err){
        console.error('Error GET User!',err)
    }
}

onMounted(async () =>{
    await Promise.all([fetchTopic(),fetchUser()])
})

const detail_commit = ref('')
const saveScore = async () =>{
    const token = localStorage.getItem('token')
    const formData = new FormData()
    const allScore = topics.value.flatMap(t =>
        t.indicates.map((i:any) =>{
            return{
                id_topic:t.id_topic,
                id_indicate:i.id_indicate,
                score:i.score,
            }
        })
    )
    if(allScore.some((s:any) => !s.score)){
        alertMsg('กรุณากรอกคะแนนให้ครบ', true)
        return
    }
    formData.append('scores',JSON.stringify(allScore))
    formData.append('detail_commit',detail_commit.value)
    try{
        await axios.post(`${commit}/save_score/save/${id_eva}`,formData,{headers:{Authorization:`Bearer ${token}`}})
        await Promise.all([fetchTopic(),fetchUser()])
        alertMsg('บันทึกคะแนนสำเร็จ')
        setTimeout(() => {
            navigateTo('/Committee/Show_eva')
        }, 1500) // 1500 ms = 1.5 วินาที
    }catch(err){
        console.error('Error POST Score!',err)
        alertMsg('เกิดข้อผิดพลาด บันทึกไม่สำเร็จ', true)
    }
}
</script>

<style scoped>

</style>