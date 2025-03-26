<template>
    <el-container class="h-100vh">
        <el-aside width="50%" class="p-4">
            <!-- 返回按钮 -->
            <el-button @click="handleBack" class="back-button">
                <el-icon><Back /></el-icon>返回首页
            </el-button>
            <el-space direction="vertical" fill class="w-100">
                <!-- 基本信息区 -->
                <el-card>
                    <el-form label-suffix="：">
                        <el-form-item label="标题">
                            <el-input v-model="themeDetail.name" placeholder="请输入标题" size="large" />
                        </el-form-item>
                        <el-form-item label="当前模型">
                            <div class="flexitem-1">{{ selectedModelName }}</div>
                            <el-button type="primary" link @click="handleSelectModel">选择模型</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>

                <!-- 提示词编辑区 -->
                <el-card>
                    <el-form label-suffix="：">
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
                            <el-button type="primary" @click="handleSubmit" class="w-100">
                                <el-icon class="mr-2"><Position /></el-icon>提交
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
                <div v-else v-html="aiResponse"></div>
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
const themeId = isCreate ? 0 : Number(route.params.id);

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

const selectedModelName = ref('未选择');
const aiResponse = ref('');
const modelDialogVisible = ref(false);

onMounted(async () => {
    if (!isCreate) {
        const detail = await request('theme-get-detail', { id: themeId });
        if (detail) {
            themeDetail.value = detail;
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
    await request(isCreate ? 'theme-create' : 'theme-update', themeDetail.value);
    ElMessage.success('提交成功，请等待AI响应...');
};
const md = markdown();
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

<style scoped>
.h-100vh {
    height: 100vh;
}

.w-100 {
    width: 100%;
}

.p-4 {
    padding: 16px;
}

.mr-2 {
    margin-right: 8px;
}

.back-button {
    width: 100px;
    padding: 8px 16px;
    font-size: 14px;
    z-index: 1;
    margin-bottom: 20px;
}
</style>
