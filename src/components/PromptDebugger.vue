<template>
    <el-form :model="form" label-width="120px">
        <el-form-item label="标题">
            <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="AI模型地址">
            <el-input v-model="form.modelUrl" />
        </el-form-item>
        <el-form-item label="AI模型名称">
            <el-input v-model="form.modelName" />
        </el-form-item>
        <el-form-item label="API Key">
            <el-input v-model="form.apiKey" type="password" />
        </el-form-item>
        <el-form-item label="Prompt">
            <el-input v-model="form.prompt" type="textarea" />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit">Submit</el-button>
        </el-form-item>
    </el-form>
    <el-card v-if="response" class="response-card">
        <div v-html="response" />
    </el-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

const form = ref({
    title: '',
    modelUrl: '',
    modelName: '',
    apiKey: '',
    prompt: '',
});
const response = ref('');

const onSubmit = async () => {
    try {
        response.value = await window.ipcRenderer.invoke('submit-prompt', form.value);
    } catch (error) {
        ElMessage.error('Error submitting prompt');
        console.error(error);
    }
};
</script>

<style scoped>
.response-card {
    margin-top: 20px;
}
</style>
