<template>
    <el-container class="h-100vh">
        <el-aside width="50%" class="p-4">
            <el-space direction="vertical" fill class="w-100">
                <!-- 基本信息区 -->
                <el-card>
                    <el-form>
                        <el-form-item>
                            <el-input v-model="themeDetail.name" placeholder="请输入标题" size="large" />
                        </el-form-item>
                        <el-form-item>
                            <el-row align="middle" justify="space-between" class="p-4">
                                <el-col>
                                    <el-text class="text-secondary mr-4">当前模型</el-text>
                                    <el-text>{{ selectedModelName }}</el-text>
                                </el-col>
                                <el-col :span="4">
                                    <el-button type="primary" link @click="handleSelectModel">选择模型</el-button>
                                </el-col>
                            </el-row>
                        </el-form-item>
                    </el-form>
                </el-card>

                <!-- 提示词编辑区 -->
                <el-card>
                    <el-form>
                        <el-form-item label="系统提示词">
                            <el-input
                                v-model="themeDetail.systemPrompt"
                                type="textarea"
                                :rows="4"
                                placeholder="请输入系统提示词..."
                            />
                        </el-form-item>
                        <el-form-item label="用户提示词">
                            <el-input
                                v-model="themeDetail.userPrompt"
                                type="textarea"
                                :rows="4"
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
        <el-main class="p-4">
            <el-card>
                <template #header>
                    <span>AI响应</span>
                </template>
                <el-empty v-if="!aiResponse" description="AI响应将显示在这里..." />
                <div v-else>{{ aiResponse }}</div>
            </el-card>
        </el-main>
    </el-container>
    <ModelDialog v-model="modelDialogVisible" @select="handleModelSelect" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Upload, Position } from '@element-plus/icons-vue';
import request from '@/shared/request';
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
    await request('theme-update', themeDetail.value);
    // TODO: 调用AI生成响应
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
</style>
