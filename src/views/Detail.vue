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
import MarkdownIt from 'markdown-it';

const form = ref({
    title: '',
    modelUrl: 'https://api.siliconflow.cn',
    modelName: 'deepseek-ai/DeepSeek-V3',
    apiKey: '',
    prompt: '请介绍福州市，用尽量简洁的语言，控制在50个字以内。',
});
const response = ref('');
const md = new MarkdownIt();

const onSubmit = async () => {
    try {
        response.value = '';
        await window.ipcRenderer.invoke('submit-prompt', JSON.stringify(form.value));
    } catch (error) {
        ElMessage.error('Error submitting prompt');
        console.error(error);
    }
};

let accumulatedMarkdown = '';

window.ipcRenderer.on('ai-response-chunk', (event, { data }) => {
    accumulatedMarkdown += data;
    response.value = md.render(accumulatedMarkdown);
});

window.ipcRenderer.on('ai-response-end', () => {
    ElMessage.success('Prompt completed');
});
</script>

<style scoped>
.response-card {
    margin-top: 20px;
}
</style>
