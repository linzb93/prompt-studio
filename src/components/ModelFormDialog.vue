<template>
    <el-dialog v-model="visible" title="模型配置">
        <el-form :model="form" label-width="120px">
            <el-form-item label="AI模型地址">
                <el-input v-model="form.modelUrl" />
            </el-form-item>
            <el-form-item label="AI模型名称">
                <el-input v-model="form.modelName" />
            </el-form-item>
            <el-form-item label="API Key">
                <el-input v-model="form.apiKey" type="password" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="visible = false">取消</el-button>
            <el-button type="primary" @click="onSubmit">确定</el-button>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const visible = defineModel('visible', { default: false });
const form = ref({
    modelUrl: 'https://api.siliconflow.cn',
    modelName: 'deepseek-ai/DeepSeek-V3',
    apiKey: '',
});

const emit = defineEmits(['submit']);

const onSubmit = () => {
    emit('submit', form.value);
    visible.value = false;
};
</script>
