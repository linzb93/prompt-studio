<template>
    <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="title" label="标题" width="180" />
        <el-table-column label="操作">
            <template #default="scope">
                <el-link type="primary" :underline="false" @click="handleDetail(scope.row)">查看详情</el-link>
            </template>
        </el-table-column>
    </el-table>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const tableData = ref([
    {
        title: '示例标题1',
    },
    {
        title: '示例标题2',
    },
]);

const handleDetail = (row: any) => {
    router.push({ name: 'Detail' });
};
</script>
