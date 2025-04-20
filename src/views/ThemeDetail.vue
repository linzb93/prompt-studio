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
                            <div class="relative full-width">
                                <el-input
                                    v-model="themeDetail.userPrompt"
                                    type="textarea"
                                    :rows="4"
                                    class="user-prompt-input"
                                    resize="none"
                                    placeholder="请输入用户提示词..."
                                />
                            </div>
                        </el-form-item>
                        <el-form-item label="附件">
                            <div v-if="!themeDetail.attachment">
                                <div v-if="ossStore.isConfigured" class="flexalign-center">
                                    <el-upload
                                        class="upload-demo"
                                        action="#"
                                        :auto-upload="false"
                                        :on-change="handleUploadChange"
                                        :limit="1"
                                    >
                                        <el-button type="primary">点击上传</el-button>
                                    </el-upload>
                                    <el-button type="primary" class="ml10" @click="handleOpenAttachmentDialog"
                                        >从资源库选择</el-button
                                    >
                                </div>

                                <el-button v-else type="primary" @click="handleOpenSetting">请设置OSS</el-button>
                            </div>
                            <div v-else>
                                <div v-if="themeDetail.attachment.isImage" class="image-preview">
                                    <el-image
                                        :src="themeDetail.attachment.url"
                                        :fit="'cover'"
                                        :style="{ width: '50px', height: '50px' }"
                                    />
                                    <div class="image-mask">
                                        <el-button type="primary" circle @click="handleReupload">
                                            <el-icon><Refresh /></el-icon>
                                        </el-button>
                                    </div>
                                </div>
                                <div v-else class="file-preview">
                                    <span class="file-url">{{ themeDetail.attachment.url }}</span>
                                    <el-button type="primary" link @click="handleReupload">重新上传</el-button>
                                </div>
                            </div>
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
    <AttachmentDialog v-model="attachmentDialogVisible" @select="handleAttachmentSelect" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useOSSStore } from '@/store/oss';
import { Position, Back, Refresh } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { handleMainPost } from '@/shared/util';
import request from '@/shared/request';
import markdown from 'markdown-it';
import ModelDialog from '@/components/ModelDialog.vue';
import AttachmentDialog from '@/components/AttachmentDialog.vue';
import type { FormInstance, FormItemRule } from 'element-plus';

const route = useRoute();
const isCreate = route.name === 'theme-create';
const themeId = isCreate ? 0 : Number(route.query.id);

interface ThemeDetail {
    id: number;
    name: string;
    createTime: string;
    systemPrompt?: string;
    userPrompt: string;
    modelId: number;
    modelName?: string;
    attachment?: {
        url: string;
        isImage: boolean;
    };
}

const themeDetail = ref<ThemeDetail>({
    id: themeId,
    name: '',
    createTime: new Date().toISOString(),
    systemPrompt: '',
    userPrompt: '',
    modelId: 0,
    attachment: undefined,
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
const attachmentDialogVisible = ref(false);
const settingVisible = ref(false);
const md = markdown();
const ossStore = useOSSStore();
onMounted(async () => {
    if (!isCreate) {
        const detail = await request('theme-get-detail', { id: themeId });
        themeDetail.value = detail;
        aiResponse.value = md.render(detail.aiResponse);
        selectedModelName.value = detail.modelName;
    }
    ossStore.checkConfig();
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
interface ElUploadFileItem {
    raw: {
        path: string;
        name: string;
    };
}
const handleUploadChange = async (file: ElUploadFileItem) => {
    try {
        const response = await request('oss-upload-file', {
            filePath: file.raw.path,
        });
        const url = response.url;
        const fileName = file.raw.name.toLowerCase();
        const isImage = /\.(jpg|jpeg|png|gif|webp)$/.test(fileName);
        themeDetail.value.attachment = { url, isImage };
        ElMessage.success('文件上传成功');
    } catch (error) {
        if (error !== 'cancel') {
            ElMessage.error('文件上传失败');
        }
    }
};

const handleReupload = () => {
    themeDetail.value.attachment = undefined;
};

const handleOpenAttachmentDialog = () => {
    attachmentDialogVisible.value = true;
};

const handleAttachmentSelect = (attachment: any) => {
    themeDetail.value.attachment = {
        url: attachment.url,
        isImage: /\\.(jpg|jpeg|png|gif|webp)$/.test(attachment.name.toLowerCase()),
    };
};

const handleOpenSetting = () => {
    router.push({
        path: '/setting',
        query: {
            type: 'oss',
        },
    });
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

.upload-demo {
    display: flex;
    align-items: center;
}

.mr-1 {
    margin-right: 4px;
}

.mt-2 {
    margin-top: 8px;
}

.relative {
    position: relative;
}

.upload-icon {
    position: absolute;
    right: 17px;
    bottom: 5px;
    cursor: pointer;
    z-index: 1;
    line-height: 1;

    :deep(.el-upload) {
        display: block;
    }

    .el-icon {
        font-size: 16px;
        color: #909399;
        transition: color 0.2s;

        &:hover {
            color: #409eff;
        }
    }
}

:deep(.el-textarea__inner) {
    padding-bottom: 32px;
}
.user-prompt-input {
    :deep(.el-textarea__inner) {
        margin-bottom: 12px;
    }
}

.image-preview {
    position: relative;
    display: inline-block;

    .image-mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s;

        &:hover {
            opacity: 1;
        }
    }
}

.file-preview {
    display: flex;
    align-items: center;
    gap: 10px;

    .file-url {
        max-width: 300px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}
</style>
