<template>
    <v-container fluid class="py-10">
                <v-card>
                    <v-sheet class="pa-4 text-center" color="">
                        <h1 class="text-h5 font-weight-bold">จัดการตัวชี้วัด</h1>
                    </v-sheet>
                    <v-card-text>
                        <v-form @submit.prevent="saveMember">
                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-select label="หัวข้อการประเมิน" v-model="form.id_topic" :items="topic.map(p => ({title:p.name_topic,value:p.id_topic}))" :error-messages="error.name_topic" />
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="ตัวชี้วัด" v-model="form.name_indicate" :error-messages="error.name_indicate" />
                                </v-col>
                                <v-col cols="12" md="12">
                                    <v-textarea label="รายละเอียด" rows="3" v-model="form.detail_indicate" :error-messages="error.detail_indicate" />
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-select label="น้ำหนักคะแนน" v-model="form.point_indicate" :items="[1,2,3,4,5]" :error-messages="error.point_indicate" />
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-select label="ลักษณะตัวเลือกคะแนน" v-model="form.check_indicate" :items="[{title:'มี',value: 'y'},{title:'ไม่มี',value: 'n'}]" :error-messages="error.check_indicate" />
                                </v-col>
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-btn color="blue" block type="submit">{{ form.id_indicate ? 'อัปเดต' : 'บันทึก' }}</v-btn>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-btn color="error" block type="reset">ยกเลิก</v-btn>
                                    </v-col>
                                </v-row>
                            </v-row>
                        </v-form>
                        <br><br><br>
                        <v-table>
                            <thead>
                                <tr>
                                    <th class="text-center border">ลำดับ</th>
                                    <th class="text-center border">หัวข้อการประเมิน</th>
                                    <th class="text-center border">ตัวชี้วัด</th>
                                    <th class="text-center border">น้ำหนักคะแนน</th>
                                    <th class="text-center border">ลักษณะตัวเลือกคะแนน</th>
                                    <th class="text-center border">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_indicate">
                                    <td class="text-center border">{{ index+1 }}</td>
                                    <td class="text-center border">{{ items.name_topic }}<br><span class="opacity-70">{{ items.detail_indicate }}</span></td>
                                    <td class="text-center border">{{ items.name_indicate }}</td>
                                    <td class="text-center border">{{ items.point_indicate }}</td>
                                    <td class="text-center border">{{ items.check_indicate === 'y' ? 'มี' : 'ไม่มี' }}</td>
                                    <td class="text-center border">
                                        <v-btn color="warning" size="small" class="text-white" @click="edit(items)">แก้ไข</v-btn>&nbsp;
                                        <v-btn color="error" size="small" class="text-white" @click="del(items.id_indicate)">ลบ</v-btn>
                                    </td>
                                </tr>
                                <tr v-if="result.length ===0">
                                    <td colspan="10" class="text-center border">ไม่พบข้อมูล</td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-card-text>
                </v-card>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios'
import {api,staff} from '../../API/base'

const token = process.client ? localStorage.getItem('token') : null

const result = ref([])
const topic = ref([])

const form = ref({
    id_indicate:null,
    id_topic:null,
    name_indicate:'',
    detail_indicate:'',
    point_indicate:'',
    check_indicate:'',
})

const reset = () => {
    form.value = {
        id_indicate:null,
        id_topic:null,
        name_indicate:'',
        detail_indicate:'',
        point_indicate:'',
        check_indicate:'',
    }
}

const edit = (items:any) => {
    form.value = {...items}
}

const error = ref<Record<string,string>>({})

function validateForm(){
    error.value = {}
    const f = form.value
    if(!f.id_topic)error.value.id_topic='กรุณาเลือกหัวข้อการประเมิน!'
    if(!f.name_indicate)error.value.name_indicate='กรุณากรอกชื่อตัวชี้วัด!'
    if(!f.detail_indicate)error.value.detail_indicate='กรุณากรอกรายละเอียด!'
    if(!f.point_indicate)error.value.point_indicate='กรุณาเลือกน้ำหนักคะแนน!'
    if(!f.check_indicate)error.value.check_indicate='กรุณาเลือกลักษณะตัวเลือกคะแนน!'
    return Object.keys(error.value).length === 0
}

const fetch = async () => {
    try{
        const res = await axios.get(`${staff}/indicate`,{headers:{Authorization: `Bearer ${token}`}})
        result.value = res.data
        const r = await axios.get(`${staff}/topic`,{headers:{Authorization: `Bearer ${token}`}})
        topic.value = r.data
    }catch(err){
        console.error("Error Fetching!",err)
    }
}

const saveMember = async () =>{
    if(!validateForm())return
    try{
        form.value.id_indicate
        ? await axios.put(`${staff}/indicate/${form.value.id_indicate}`,form.value,{headers:{Authorization:`Bearer ${token}`}})
        : await axios.post(`${staff}/indicate`,form.value,{headers:{Authorization: `Bearer ${token}`}})
        alert('ทำรายการสำเร็จ')
        await fetch()
        await reset()
    }catch(err){
        console.error('Error!',err)
    }
}

const del = async (id_indicate:number) => {
    try{
        if(!confirm("ต้องการลบใช่หรือไม่?")) return
        await axios.delete(`${staff}/indicate/${id_indicate}`,{headers:{Authorization:`Bearer ${token}`}})
        await fetch()
        await reset()
    }catch(err){
        console.error("Error Delete",err)
    }
}

onMounted(fetch)
</script>

<style scoped>

</style>