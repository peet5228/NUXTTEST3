<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-form v-if="user.status_eva === 3">
                    <h1 class="text-h5 font-weight-bold text-center">รายงานการประเมิน</h1>
                    <v-card class="mt-2 pa-2">
                        <p>ชื่อ - นามสกุล : {{ user.first_name }} {{ user.last_name }}</p>
                        <p>รอบประเมินที่ : {{ user.round_sys }} ปี {{ user.year_sys }}</p>
                    </v-card>
                    <v-row class="mt-2" v-for="(topic,t) in topics" :key="topic.id_topic">
                        <v-col cols="12">
                            <h1 class="text-h6">{{ t+1 }}.{{ topic.name_topic }}</h1>
                            <v-table class="table">
                                <tr>
                                    <th class="pa-1 text-black bg-grey border" style="width: 10%;">ตัวชี้วัด</th>
                                    <th class="pa-1 text-black bg-grey border" style="width: 10%;">รายละเอียดตัวชี้วัด</th>
                                    <th class="pa-1 text-black bg-grey border" style="width: 10%;">น้ำหนักคะแนน</th>
                                    <th class="pa-1 text-black bg-grey border" style="width: 10%;">คะแนนเต็ม</th>
                                    <th class="pa-1 text-black bg-grey border" style="width: 10%;">คะแนนที่ได้</th>
                                </tr>
                                <tr v-for="indicate in topic.indicates" :key="indicate.id_indicate">
                                    <td class="border pa-1 text-center" style="width: 10%;">{{ indicate.name_indicate }}</td>
                                    <td class="border pa-1 text-center" style="width: 10%;">{{ indicate.detail_indicate }}</td>
                                    <td class="border pa-1 text-center" style="width: 10%;">{{ indicate.point_indicate }}</td>
                                    <td class="border pa-1 text-center" style="width: 10%;">{{ indicate.point_indicate*4 }}</td>
                                    <td class="border pa-1 text-center" style="width: 10%;">
                                        {{ (((scores[indicate.id_indicate]?.a ?? 0)+(scores[indicate.id_indicate]?.b ?? 0)+(scores[indicate.id_indicate]?.c ?? 0))/3).toFixed(2) }}
                                    </td>
                                </tr>
                            </v-table>
                        </v-col>
                    </v-row>
                    <div class="mt-4">
                        <v-card class="pa-2 text-end" color="success">คะแนนรวม : {{ ((user.total_commit)/3).toFixed(2) }} คะแนน</v-card>
                    </div>
                    <div class="mt-4">
                        <v-card class="pa-4" >
                            <v-row>
                                <v-col cols="4" class="text-center" v-for="(commit,c) in commits" :key="commit.id_commit">
                                    <img :src="`http://localhost:3001/uploads/signature/${commit.signature}`" alt="รอกรรมการประเมินยืนยันผล" width="20%"> <br>
                                    ( {{ commit.first_name }} {{ commit.last_name }} ) <br>
                                    {{ commit.level_commit }}
                                </v-col>
                            </v-row>
                        </v-card>
                    </div>
                    <div class="mt-4 text-center">
                        <v-btn color="warning" class="noP" prepend-icon="mdi-printer" @click="print()">พิมพ์</v-btn>
                    </div>
                </v-form>
                <v-alert v-else-if="user.status_eva === 2" type="info">รอกรรมการกำเนินการประเมิน</v-alert>
                <v-alert v-else-if="user.status_eva === 1" type="info">ยังไม่ได้ประเมินตนเอง</v-alert>
                <v-alert v-else type="warning">ยังไม่มีแบบประเมิน</v-alert>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
const user = ref<any>({})
const topics = ref<any>([])
const scores = ref<any>([])
const commits = ref<any>([])
import axios from 'axios'
import {eva} from '../../API/base'
const print = () => {
    window.print()
}
const fetchUser = async () =>{
    const token = localStorage.getItem('token')
    try{
        const res = await axios.get(`${eva}/score_commit/user`,{headers:{Authorization:`Bearer ${token}`}})
        user.value = res.data
    }catch(err){
        console.error('Error GET User!',err)
    }
}
const fetchTopic = async () =>{
    const token = localStorage.getItem('token')
    try{
        const res = await axios.get(`${eva}/score_commit/topic`,{headers:{Authorization:`Bearer ${token}`}})
        topics.value = res.data
    }catch(err){
        console.error('Error GET User!',err)
    }
}
const fetchScores = async () =>{
    const token = localStorage.getItem('token')
    try{
        const res = await axios.get(`${eva}/score_commit/scores`,{headers:{Authorization:`Bearer ${token}`}})
        scores.value = res.data.scores
    }catch(err){
        console.error('Error GET User!',err)
    }
}
const fetchCommits = async () =>{
    const token = localStorage.getItem('token')
    try{
        const res = await axios.get(`${eva}/score_commit/commits`,{headers:{Authorization:`Bearer ${token}`}})
        commits.value = res.data
        console.log('commit:',commits.value)
    }catch(err){
        console.error('Error GET User!',err)
    }
}

onMounted(async () =>{
    await Promise.all([fetchTopic(),fetchUser(),fetchScores(),fetchCommits()])
})

</script>

<style scoped>
@media print {
    .v-btn,.noP{
        display: none !important;;
    }
}
</style>