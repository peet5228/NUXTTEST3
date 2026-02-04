<template>
    <v-container fluid class="py-10">
                <v-card>
                    <v-sheet class="pa-4 text-center" color="">
                        <h1 class="text-h5 font-weight-bold">รายงาน</h1>
                    </v-sheet>
                    <v-card-text>
                        <v-table>
                            <thead>
                                <tr>
                                    <th class="text-center border">ลำดับ</th>
                                    <th class="text-center border">รายงาน</th>
                                    <th class="text-center border">รายละเอียด</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="text-center border">1</td>
                                    <td class="text-center border">รายงานผู้รับการประเมินผลทั้งหมด</td>
                                    <td class="text-center border">
                                        <NuxtLink to="/Staff/Re_eva"><v-btn color="warning" size="small" prepend-icon="mdi-file">รายละเอียด</v-btn></NuxtLink>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="text-center border">2</td>
                                    <td class="text-center border">รายงานกรรมการประเมินผลทั้งหมด</td>
                                    <td class="text-center border">
                                        <NuxtLink to="/Staff/Re_eva"><v-btn color="warning" size="small" prepend-icon="mdi-file">รายละเอียด</v-btn></NuxtLink>
                                    </td>
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

</script>

<style scoped>

</style>