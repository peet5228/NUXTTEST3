<template>
    <v-container fluid class="py-10">
                <v-card>
                    <v-sheet class="pa-4 text-center" color="">
                        <h1 class="text-h5 font-weight-bold">เอกสารหรือคู่มือสำหรับการประเมิน</h1>
                    </v-sheet>
                    <v-card-text>
                        <v-form v-if="!result.signature" @submit.prevent="saveMember">
                            <v-row>
                                <v-col cols="12" md="12">
                                    <v-file-input label="ไฟล์" v-model="file" accept="image/*" />
                                    <span class="text-error font-weight-bold">*** ไม่เกิน 10 MB ***</span>
                                </v-col>
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-btn color="blue" block type="submit">บันทึก</v-btn>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-btn color="error" block type="reset">ยกเลิก</v-btn>
                                    </v-col>
                                </v-row>
                            </v-row>
                        </v-form>
                        <v-table v-else>
                            <thead>
                                <tr>
                                    <th class="text-center border">ลำดับ</th>
                                    <th class="text-center border">ไฟล์</th>
                                    <th class="text-center border">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="text-center border">{{ 1 }}</td>
                                    <td class="text-center border">{{ result.signature }}</td>
                                    <td class="text-center border">
                                        <v-btn color="warning" size="small" prepend-icon="mdi-eye" @click="views(result.signature)">เปิดดู</v-btn>&nbsp;&nbsp;
                                        <v-btn color="error" size="small" class="text-white" prepend-icon="mdi-delete" @click="del(id_eva)">ลบ</v-btn>
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
import {api,commit} from '../../API/base'

const token = process.client ? localStorage.getItem('token') : null

const result = ref([])
const file = ref<File | null>(null)
const id_eva = useRoute().params.id_eva

const fetch = async () => {
    try{
        const res = await axios.get(`${commit}/signature/${id_eva}`,{headers:{Authorization: `Bearer ${token}`}})
        result.value = res.data
    }catch(err){
        console.error("Error Fetching!",err)
    }
}

const saveMember = async () =>{
    if(!file.value) return alert('กรุณาแนบไฟล์ก่อนบันทึก')
    try{
        const formData = new FormData()
        formData.append('file',file.value)
        await axios.post(`${commit}/signature/${id_eva}`,formData,{headers:{Authorization: `Bearer ${token}`}})
        alert('ทำรายการสำเร็จ')
        file.value = null
        await fetch()
    }catch(err){
        console.error('Error!',err)
    }
}

const del = async (id_doc:number) => {
    try{
        if(!confirm("ต้องการลบใช่หรือไม่?")) return
        await axios.delete(`${commit}/signature/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        await fetch()
    }catch(err){
        console.error("Error Delete",err)
    }
}

const views = (filename:string) => {
    const u = new URL(`/uploads/signature/${filename}`,commit).href
    window.open(u,'_blank')
}

onMounted(fetch)
</script>

<style scoped>

</style>