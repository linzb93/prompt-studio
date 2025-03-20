<template>
    <ModelFormDialog v-model:visible="visible" @submit="handleModelSubmit" />
    <el-form :model="form" label-width="120px">
        <el-form-item label="标题">
            <el-input v-model="form.title" />
        </el-form-item>

        <el-form-item label="模型">
            <el-button type="primary" @click="visible = true">添加</el-button>
        </el-form-item>
        <el-form-item label="Prompt">
            <el-input v-model="form.prompt" type="textarea" />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit">提交</el-button>
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
import ModelFormDialog from '../components/ModelFormDialog.vue';

const visible = ref(false);
const form = ref({
    title: '',
    prompt: '请介绍福州市，用尽量简洁的语言，控制在50个字以内。',
});

const handleModelSubmit = (modelData: any) => {
    form.value = { ...form.value, ...modelData };
};
const response = ref('');
const md = new MarkdownIt();

const onSubmit = async () => {
    try {
        response.value = '';
        accumulatedMarkdown = '';
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
