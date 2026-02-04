<template>
    <v-container fluid class="fill-height">
        <v-row align="center" justify="center">
            <v-col cols="12" md="6" lg="5">
                <v-card elevation="10" color="#7d0c14" rounded="lg">
                    <p class="text-center text-white font-weight-bold text-h5">NTC EVALUATION SYSTEM</p>
                    <p class="text-center text-white font-weight-bold">ระบบประเมินบุคลากรวิทยาลัยเทคนิคน่าน</p>
                    <v-container class="bg-white">
                        <p class="text-center font-weight-bold text-h5">เข้าสู่ระบบ</p>
                        <v-alert type="error" variant="tonal" v-if="error">{{ error }}</v-alert>
                        <v-form @submit.prevent="Login">
                            <v-text-field v-model="username" label="ชื่อผู้ใช้" prepend-inner-icon="mdi-account"></v-text-field>
                            <v-text-field v-model="password" type="password" label="รหัสผ่าน" prepend-inner-icon="mdi-lock"></v-text-field>
                            <v-select v-model="role" :items="g" label="ประเภทสมาชิก" prepend-inner-icon="mdi-account-group" />
                            <v-btn color="#7d0c14" block type="submit">เข้าสู่ระบบ</v-btn>
                        </v-form>
                        <br>
                        <center><NuxtLink to="/regis" class="text-blue">สมัครสมาชิก</NuxtLink></center>
                    </v-container>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import auth from '../API/auth'
const error = ref('')
const username = ref('')
const password = ref('')
const role = ref('')
const g = ['ฝ่ายบุคลากร','กรรมการประเมิน','ผู้รับการประเมินผล']

definePageMeta({
    layout:false
})

const Login = async () =>  {
    try{
        const res = await auth.login({
            username:username.value,
            password:password.value,
            role:role.value,
        })
        console.log("API Response : ",res.data)
        localStorage.setItem("token",res.data.token)
        const useRole = res.data.role
        if(useRole === 'ฝ่ายบุคลากร') useRouter().push("/Staff")
        if(useRole === 'กรรมการประเมิน') useRouter().push("/Committee")
        if(useRole === 'ผู้รับการประเมินผล') useRouter().push("/Evaluatee")
    }catch(err){
        console.error("Login Failed!",err)
        error.value = error.response?.data?.message || 'เข้าสู่ระบบไม่สำเร็จ'
    }
}
</script>

<style scoped>

</style>