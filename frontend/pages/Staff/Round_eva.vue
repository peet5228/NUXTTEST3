<template>
    <v-container fluid class="py-10">
                <v-card>
                    <v-sheet class="pa-4 text-center" color="">
                        <h1 class="text-h5 font-weight-bold">จัดการรอบการประเมิน</h1>
                    </v-sheet>
                    <v-card-text>
                        <v-form @submit.prevent="saveMember">
                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-text-field label="วันที่เปิดรอบการประเมิน" type="date" v-model="form.day_open" :error-messages="error.day_open" />
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="วันที่ปิดรอบการประเมิน" type="date" v-model="form.day_out" :error-messages="error.day_out" />
                                </v-col>
                                <v-col cols="12" md="12">
                                    <v-select label="รอบการประเมิน" v-model="form.round_sys" :items="[{title:'รอบการประเมินที่ 1',value:'1'},{title:'รอบการประเมินที่ 2',value:'2'}]" :error-messages="error.round_sys" />
                                </v-col>
                                 <v-col cols="12" md="6">
                                    <v-text-field label="ปี" type="number" v-model="form.year_sys" :error-messages="error.year_sys" />
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-select label="สถานะ เปิด-ปิด รอบการประเมิน" v-model="form.status_sys" :items="[{title:'เปิด',value:'y'},{title:'ปิด',value:'n'}]" :error-messages="error.status_sys" />
                                </v-col>
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-btn color="blue" block type="submit">{{ form.id_sys ? 'อัปเดต' : 'บันทึก' }}</v-btn>
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
                                    <th class="text-center border">วันที่เปิดรอบการประเมิน</th>
                                    <th class="text-center border">วันที่ปิดรอบการประเมิน</th>
                                    <th class="text-center border">รอบการประเมิน</th>
                                    <th class="text-center border">สถานะ เปิด-ปิด รอบการประเมิน</th>
                                    <th class="text-center border">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_sys">
                                    <td class="text-center border">{{ index+1 }}</td>
                                    <td class="text-center border">{{ items.day_open }}</td>
                                    <td class="text-center border">{{ items.day_out }}</td>
                                    <td class="text-center border">รอบการประเมินที่ {{ items.round_sys }} ปี {{ items.status_sys }}</td>
                                    <td class="text-center border">{{ items.status_sys === 'y' ? 'เปิด' : 'ปิด' }}</td>
                                    <td class="text-center border">
                                        <v-btn color="warning" size="small" class="text-white" @click="edit(items)">แก้ไข</v-btn>&nbsp;
                                        <v-btn color="error" size="small" class="text-white" @click="del(items.id_sys)">ลบ</v-btn>
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
    id_sys:null,
    day_open:null,
    day_out:null,
    round_sys:'',
    year_sys:'',
    status_sys:'',
})

const reset = () => {
    form.value = {
        id_sys:null,
        day_open:null,
        day_out:null,
        round_sys:'',
        year_sys:'',
        status_sys:'',
    }
}

const edit = (items:any) => {
    form.value = {...items}
}

const error = ref<Record<string,string>>({})

function validateForm(){
    error.value = {}
    const f = form.value
    if(!f.day_open)error.value.day_open='กรุณาเลือกวันที่เปิดรอบการประเมิน!'
    if(!f.day_out)error.value.day_out='กรุณาเลือกวันที่ปิดรอบการประเมิน!'
    if(!f.round_sys)error.value.round_sys='กรุณาเลือกรอบการประเมิน!'
    if(!f.year_sys)error.value.year_sys='กรุณาเลือกปีการประเมิน!'
    if(!f.status_sys)error.value.status_sys='กรุณาเลือกสถานะ เปิด-ปิด รอบการประเมิน!'
    return Object.keys(error.value).length === 0
}

const fetch = async () => {
    try{
        const res = await axios.get(`${staff}/round_eva`,{headers:{Authorization: `Bearer ${token}`}})
        result.value = res.data
    }catch(err){
        console.error("Error Fetching!",err)
    }
}

const saveMember = async () =>{
    if(!validateForm())return
    try{
        form.value.id_sys
        ? await axios.put(`${staff}/round_eva/${form.value.id_sys}`,form.value,{headers:{Authorization:`Bearer ${token}`}})
        : await axios.post(`${staff}/round_eva`,form.value,{headers:{Authorization: `Bearer ${token}`}})
        alert('ทำรายการสำเร็จ')
        await fetch()
        await reset()
    }catch(err){
        console.error('Error!',err)
    }
}

const del = async (id_sys:number) => {
    try{
        if(!confirm("ต้องการลบใช่หรือไม่?")) return
        await axios.delete(`${staff}/round_eva/${id_sys}`,{headers:{Authorization:`Bearer ${token}`}})
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