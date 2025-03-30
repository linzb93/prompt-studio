<template>
    <!-- 返回按钮 -->
    <el-button @click="handleBack" class="back-button">
        <el-icon><Back /></el-icon>返回首页
    </el-button>
    <el-container>
        <el-aside width="50%" class="p-4">
            <el-space direction="vertical" fill class="full-width">
                <el-card>
                    <el-form label-suffix="：" label-width="110px" :model="themeDetail" :rules="rules" ref="formRef">
                        <el-form-item label="标题" prop="name">
                            <el-input v-model="themeDetail.name" placeholder="请输入标题" size="large" />
                        </el-form-item>
                        <el-form-item label="当前模型" prop="modelId">
                            <p class="mr5" v-if="selectedModelName !== ''">{{ selectedModelName }}</p>
                            <el-button type="primary" link @click="handleSelectModel">{{
                                selectedModelName !== '' ? '更换模型' : '选择模型'
                            }}</el-button>
                        </el-form-item>
                        <el-form-item label="系统提示词" prop="systemPrompt">
                            <el-input
                                v-model="themeDetail.systemPrompt"
                                type="textarea"
                                :rows="4"
                                resize="none"
                                placeholder="请输入系统提示词..."
                            />
                        </el-form-item>
                        <el-form-item label="用户提示词" prop="userPrompt">
                            <el-input
                                v-model="themeDetail.userPrompt"
                                type="textarea"
                                :rows="4"
                                resize="none"
                                placeholder="请输入用户提示词..."
                            />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="handleSubmit" class="btn-submit">
                                <el-icon class="mr5"><Position /></el-icon>提交
                            </el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-space>
        </el-aside>

        <!-- 右侧响应区域 -->
        <el-main class="p-4 mb30">
            <el-card>
                <template #header>
                    <span>AI生成</span>
                </template>
                <el-empty v-if="aiResponse === ''" description="AI生成结果将显示在这里..." />
                <div v-else class="ai-response-cont" v-html="aiResponse"></div>
            </el-card>
        </el-main>
    </el-container>
    <ModelDialog v-model="modelDialogVisible" @select="handleModelSelect" :id="themeDetail.modelId" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Position, Back } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { handleMainPost } from '@/shared/util';
import request from '@/shared/request';
import markdown from 'markdown-it';
import ModelDialog from '@/components/ModelDialog.vue';
import type { FormInstance, FormItemRule } from 'element-plus';

const route = useRoute();
const isCreate = route.name === 'theme-create';
const themeId = isCreate ? 0 : Number(route.query.id);

interface ThemeDetail {
    id: number;
    name: string;
    createTime: string;
    systemPrompt?: string;
    userPrompt?: string;
    modelId: number;
    modelName?: string;
}

const themeDetail = ref<ThemeDetail>({
    id: themeId,
    name: '',
    createTime: new Date().toISOString(),
    systemPrompt: '',
    userPrompt: '',
    modelId: 0,
});

const rules = {
    name: [{ required: true, message: '请输入标题', trigger: 'blur' }],
    modelId: {
        validator: (rule: FormItemRule, value: number, callback: any) => {
            if (value === 0) {
                callback(new Error('请选择模型'));
            } else {
                callback();
            }
        },
    },
    systemPrompt: [{ required: true, message: '请输入系统提示词', trigger: 'blur' }],
    userPrompt: [{ required: true, message: '请输入用户提示词', trigger: 'blur' }],
};

const formRef = ref<FormInstance>();
const selectedModelName = ref('');
const aiResponse = ref('');
const modelDialogVisible = ref(false);
const md = markdown();

onMounted(async () => {
    if (!isCreate) {
        const detail = await request('theme-get-detail', { id: themeId });
        themeDetail.value = detail;
        aiResponse.value = md.render(detail.aiResponse);
        selectedModelName.value = detail.modelName;
    }
});

const handleSelectModel = () => {
    modelDialogVisible.value = true;
};

const handleModelSelect = (model: any) => {
    themeDetail.value.modelId = model.id;
    selectedModelName.value = model.name;
};

const handleSubmit = () => {
    if (!formRef.value) return;

    formRef.value.validate(async (valid) => {
        if (valid) {
            aiResponse.value = '';
            aiResponseOriginText = '';
            ElMessage.success('提交成功，请等待AI响应...');
            await request(isCreate ? 'theme-create' : 'theme-update', themeDetail.value);
        }
    });
};

let aiResponseOriginText = '';
handleMainPost('theme-chat-chunk', (content: string) => {
    aiResponseOriginText += content;
    aiResponse.value = md.render(aiResponseOriginText);
});

const router = useRouter();

const handleBack = () => {
    router.push('/');
};
</script>

<style scoped lang="scss">
.btn-submit {
    width: 200px;
}

.p-4 {
    padding: 16px;
}

.back-button {
    width: 100px;
    padding: 8px 16px;
    font-size: 14px;
    z-index: 1;
    margin-left: 18px;
    margin-top: 10px;
}
</style>
