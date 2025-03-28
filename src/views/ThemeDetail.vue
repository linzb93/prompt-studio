<template>
    <!-- 返回按钮 -->
    <el-button @click="handleBack" class="back-button">
        <el-icon><Back /></el-icon>返回首页
    </el-button>
    <el-container>
        <el-aside width="50%" class="p-4">
            <el-space direction="vertical" fill class="full-width">
                <el-card>
                    <el-form label-suffix="：" label-width="100px">
                        <el-form-item label="标题">
                            <el-input v-model="themeDetail.name" placeholder="请输入标题" size="large" />
                        </el-form-item>
                        <el-form-item label="当前模型">
                            <p class="mr5" v-if="selectedModelName !== ''">{{ selectedModelName }}</p>
                            <el-button type="primary" link @click="handleSelectModel">{{
                                selectedModelName !== '' ? '更换模型' : '选择模型'
                            }}</el-button>
                        </el-form-item>
                        <el-form-item label="系统提示词">
                            <el-input
                                v-model="themeDetail.systemPrompt"
                                type="textarea"
                                :rows="4"
                                resize="none"
                                placeholder="请输入系统提示词..."
                            />
                        </el-form-item>
                        <el-form-item label="用户提示词">
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
                    <span>AI响应</span>
                </template>
                <el-empty v-if="aiResponse === ''" description="AI响应将显示在这里..." />
                <div v-else class="response-cont" v-html="aiResponse"></div>
            </el-card>
        </el-main>
    </el-container>
    <ModelDialog v-model="modelDialogVisible" @select="handleModelSelect" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Upload, Position, Back } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { handleMainPost } from '@/shared/util';
import request from '@/shared/request';
import markdown from 'markdown-it';
import ModelDialog from '@/components/ModelDialog.vue';

const route = useRoute();
const isCreate = route.name === 'theme-create';
const themeId = isCreate ? 0 : Number(route.query.id);

interface ThemeDetail {
    id: number;
    name: string;
    createTime: string;
    systemPrompt?: string;
    userPrompt?: string;
    modelId?: number;
}

const themeDetail = ref<ThemeDetail>({
    id: themeId,
    name: '',
    createTime: new Date().toISOString(),
    systemPrompt: '',
    userPrompt: '',
    modelId: undefined,
});

const selectedModelName = ref('');
const aiResponse = ref('');
const modelDialogVisible = ref(false);
const md = markdown();

onMounted(async () => {
    if (!isCreate) {
        const detail = await request('theme-get-detail', { id: themeId });
        if (detail) {
            themeDetail.value = detail;
            aiResponse.value = md.render(detail.aiResponse);
        }
    }
});

const handleSelectModel = () => {
    modelDialogVisible.value = true;
};

const handleModelSelect = (model: any) => {
    themeDetail.value.modelId = model.id;
    selectedModelName.value = model.name;
};

const handleSubmit = async () => {
    aiResponse.value = '';
    tempAiText = '';
    ElMessage.success('提交成功，请等待AI响应...');
    await request(isCreate ? 'theme-create' : 'theme-update', themeDetail.value);
};
let tempAiText = '';
handleMainPost('theme-chat-chunk', (content: string) => {
    tempAiText += content;
    aiResponse.value = md.render(tempAiText);
});

const router = useRouter();

const handleBack = () => {
    router.push('/');
};
</script>

<style scoped lang="scss">
.response-cont {
    :deep(h1) {
        font-size: 22px;
        margin-bottom: 10px;
        line-height: 2;
        font-weight: bold;
    }
    :deep(h2) {
        font-size: 20px;
        margin-bottom: 10px;
        font-weight: bold;
        line-height: 2;
    }
    :deep(h3) {
        font-size: 16px;
        margin-bottom: 7px;
        font-weight: bold;
        line-height: 2;
    }
    :deep(pre) {
        background-color: #f5f5f5;
        padding: 10px;
        border-radius: 4px;
        overflow-x: auto;
        margin-bottom: 7px;
        margin-top: 7px;
    }
    :deep(table) {
        width: 100%;
        border-collapse: collapse;
        border: 1px solid #ccc;
        td,
        th {
            border: 1px solid #ccc;
            padding: 4px 5px;
        }
    }
}
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
