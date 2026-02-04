<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-form v-if="user.status_eva === 1" @submit.prevent="saveScore">
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
                                        <v-textarea label="คำอธิบายเพิ่มเติม(ถ้ามี)" v-model="indicate.detail_eva" rows="2"></v-textarea>
                                        <v-file-input label="file" @change="onFileChange($event,topic.id_topic,indicate.id_indicate)" v-model="indicate.file_eva" accpet="image/*,.pdf" ></v-file-input>
                                        <v-select v-if="indicate.check_indicate === 'y'" label="ใส่คะแนนประเมิน 1-4" v-model="indicate.score" :items="[1,2,3,4]"></v-select>
                                        <v-text-field v-else label="ใส่คะแนนประเมิน 1-4" v-model="indicate.score" type="number" @input="indicate.score > 4 ? indicate.score = 4 : null"></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-card>
                        </v-col>
                    </v-row>
                    <div class="mt-4 text-center">
                        <br><v-btn type="submit" color="blue">บันทึกคะแนน</v-btn><br><br><br>
                    </div>
                </v-form>
                <v-alert v-else-if="user.status_eva === 2 || user.status_eva === 3" type="success">ประเมินสำเร็จสำเร็จแล้ว</v-alert>
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
import {eva} from '../../API/base'

// alert
// 1. สร้างตัวแปรเก็บสถานะ
const notify = reactive({ show: false, text: '', color: 'success' })

// 2. ฟังก์ชันเรียกใช้ (สั้นๆ)
const alertMsg = (text: string, isError = false) => {
    notify.text = text
    notify.color = isError ? 'warning' : 'success' // ถ้า Error สีแดง, ถ้าปกติ สีเขียว
    notify.show = true
}

const fetchUser = async () =>{
    const token = localStorage.getItem('token')
    try{
        const res = await axios.get(`${eva}/selfeva/user`,{headers:{Authorization:`Bearer ${token}`}})
        user.value = res.data
    }catch(err){
        console.error('Error GET User!',err)
    }
}
const fetchTopic = async () =>{
    const token = localStorage.getItem('token')
    try{
        const res = await axios.get(`${eva}/selfeva/topic`,{headers:{Authorization:`Bearer ${token}`}})
        topics.value = res.data
    }catch(err){
        console.error('Error GET User!',err)
    }
}

onMounted(async () =>{
    await Promise.all([fetchTopic(),fetchUser()])
})

const fileMap = ref<Record<string,File>>({})
const onFileChange = (event:Event,id_topic:number,id_indicate:number) =>{
    const file = (event.target as HTMLInputElement)?.files?.[0]
    if(!file)return
    fileMap.value[`${id_topic}-${id_indicate}`] = file
}

const saveScore = async () =>{
    const token = localStorage.getItem('token')
    const formData = new FormData()
    const allScore = topics.value.flatMap(t =>
        t.indicates.map((i:any) =>{
            const key = `${t.id_topic}-${i.id_indicate}`
            const file = fileMap.value[key]
            if(file)formData.append(`file_${key}`,file)
            return{
                id_topic:t.id_topic,
                id_indicate:i.id_indicate,
                score:i.score,
                detail_eva:i.detail_eva,
                file_key:file ? `file_${key}` : null
            }
        })
    )
    if(allScore.some((s:any) => !s.score)){
        alertMsg('กรุณากรอกคะแนนให้ครบ', true)
        return
    }
    formData.append('scores',JSON.stringify(allScore))
    try{
        await axios.post(`${eva}/selfeva/save`,formData,{headers:{Authorization:`Bearer ${token}`}})
        alertMsg('บันทึกคะแนนสำเร็จ')
        await Promise.all([fetchTopic(),fetchUser()])
    }catch(err){
        console.error('Error POST Score!',err)
        alertMsg('เกิดข้อผิดพลาด บันทึกไม่สำเร็จ', true)
    }
}

</script>

<style scoped>

</style>