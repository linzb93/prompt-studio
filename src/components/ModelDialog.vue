<template>
    <!-- 主模型管理弹窗 -->
    <el-dialog
        :model-value="modelValue"
        title="模型管理"
        width="750px"
        :close-on-click-modal="false"
        :before-close="handleClose"
    >
        <el-space fill class="full-width" v-if="!loading">
            <!-- 添加按钮 -->
            <el-row v-if="modelList.length">
                <el-col>
                    <el-button type="primary" @click="handleAdd">
                        <el-icon><Plus /></el-icon>添加模型
                    </el-button>
                </el-col>
            </el-row>

            <!-- 模型列表 -->
            <el-row>
                <el-radio-group v-if="modelList.length" v-model="selectedModel">
                    <el-space direction="vertical" fill>
                        <el-card v-for="model in modelList" :key="model.id">
                            <div class="flexalign-start">
                                <div class="flexitem-1">
                                    <el-radio :label="model.id" class="title">{{ model.name }}</el-radio>
                                </div>
                                <el-button-group>
                                    <el-button type="primary" @click="handleEdit(model)">编辑</el-button>
                                    <el-button class="ml5" type="danger" @click="handleDelete(model)">删除</el-button>
                                </el-button-group>
                            </div>
                            <el-text type="info" class="url">{{ model.url }}</el-text>
                        </el-card>
                    </el-space>
                </el-radio-group>
                <div class="m-auto" v-else>
                    <el-empty description="暂无模型">
                        <el-button type="primary" @click="handleAdd">添加模型</el-button>
                    </el-empty>
                </div>
            </el-row>
        </el-space>
        <!-- 底部按钮 -->
        <template #footer>
            <el-col class="text-right">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="handleSelect">确定</el-button>
            </el-col>
        </template>
    </el-dialog>

    <!-- 添加/编辑模型弹窗 -->
    <el-dialog
        v-if="formDialogVisible"
        v-model="formDialogVisible"
        :close-on-click-modal="false"
        :title="currentModel ? '编辑模型' : '添加模型'"
        width="400px"
    >
        <el-form :model="modelForm" label-width="100px" :rules="formRules" ref="modelFormRef">
            <el-form-item label="模型名称" required prop="name">
                <el-input v-model="modelForm.name" placeholder="请输入模型名称" />
            </el-form-item>
            <el-form-item label="平台" required prop="platform">
                <el-select v-model="modelForm.platform" placeholder="请选择平台" @change="handlePlatformChange">
                    <el-option
                        v-for="platform in platforms"
                        :key="platform.label"
                        :label="platform.label"
                        :value="platform.url"
                    />
                </el-select>
            </el-form-item>
            <el-form-item v-if="modelForm.platform === 'custom'" label="平台地址" required prop="url">
                <el-input v-model="modelForm.url" placeholder="请输入平台地址" />
            </el-form-item>
            <el-form-item label="model" required prop="model">
                <el-input v-model="modelForm.model" placeholder="请输入模型model" />
            </el-form-item>
            <el-form-item label="API Key" required prop="apiKey">
                <el-input v-model="modelForm.apiKey" type="password" show-password placeholder="请输入API Key" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="formDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleSubmit">确定</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, readonly } from 'vue';
import { Plus } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import request from '@/shared/request';
import { omit } from 'lodash-es';

interface Model {
    id: number;
    name: string;
    url: string;
    platform?: string;
    apiKey: string;
    model: string;
}

const props = defineProps<{
    modelValue: boolean;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
    (e: 'select', model: Model | undefined): void;
}>();

const loading = ref(false);
const modelList = ref<Model[]>([]);
const formDialogVisible = ref(false);
const currentModel = ref<Model | null>(null);
const modelForm = ref<Omit<Model, 'id'>>({ name: '', url: '', apiKey: '', model: '' });
const modelFormRef = ref();
const formRules = {
    name: [{ required: true, message: '请输入模型名称', trigger: 'blur' }],
    platform: [{ required: true, message: '请选择平台', trigger: 'change' }],
    model: [{ required: true, message: '请输入模型model', trigger: 'blur' }],
    apiKey: [{ required: true, message: '请输入API Key', trigger: 'blur' }],
    url: [
        {
            //@ts-ignore
            validator: (rule, value, callback) => {
                if (modelForm.value.platform === 'custom' && !value) {
                    callback(new Error('请输入平台地址'));
                } else {
                    callback();
                }
            },
            trigger: 'blur',
        },
    ],
};

// 获取模型列表
const getModelList = async () => {
    loading.value = true;
    try {
        const data = await request('model-get-list', {
            pageIndex: 1,
            pageSize: 100,
        });
        modelList.value = data;
    } catch (error) {
        ElMessage.error('获取模型列表失败');
    } finally {
        loading.value = false;
    }
};

// 关闭弹窗
const handleClose = () => {
    emit('update:modelValue', false);
};

// 添加模型
const handleAdd = () => {
    currentModel.value = null;
    modelForm.value = { name: '', url: '', apiKey: '', model: '' };
    formDialogVisible.value = true;
};

const platforms = readonly([
    {
        label: '硅基流动',
        url: `https://api.siliconflow.cn`,
    },
    {
        label: 'DeepSeek',
        url: `https://api.deepseek.com`,
    },
    {
        label: '火山方舟大模型',
        url: `https://ark.cn-beijing.volces.com/api/v3`,
    },
    {
        label: '自定义',
        url: 'custom',
    },
]);

// 编辑模型
const handleEdit = (model: Model) => {
    currentModel.value = model;
    modelForm.value = { name: model.name, model: model.model, url: model.url, apiKey: model.apiKey };
    modelForm.value.platform = platforms.find((item) => item.url === model.url) ? model.url : 'custom';
    formDialogVisible.value = true;
};
// 平台改变
const handlePlatformChange = (value: string) => {
    if (value === 'custom') {
        modelForm.value.url = '';
    }
};

// 删除模型
const handleDelete = async (model: Model) => {
    try {
        await ElMessageBox.confirm('确定要删除这个模型吗？', '删除确认', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        });
        await request('model-delete', { id: model.id });
        ElMessage.success('删除成功');
        getModelList();
    } catch (error) {
        if (error !== 'cancel') {
            ElMessage.error('删除失败');
        }
    }
};

// 提交表单
const handleSubmit = async () => {
    try {
        await modelFormRef.value.validate();
    } catch (error) {
        return;
    }
    try {
        if (currentModel.value) {
            const model = {
                id: currentModel.value.id,
                ...omit(modelForm.value, ['platform']),
                url: modelForm.value.platform === 'custom' ? modelForm.value.url : modelForm.value.platform,
            };
            await request('model-update', model);
            ElMessage.success('编辑成功');
        } else {
            const model = {
                ...omit(modelForm.value, ['platform']),
                url: modelForm.value.platform === 'custom' ? modelForm.value.url : modelForm.value.platform,
            };
            await request('model-create', model);
            ElMessage.success('添加成功');
        }
        formDialogVisible.value = false;
        getModelList();
    } catch (error) {
        ElMessage.error(currentModel.value ? '编辑失败' : '添加失败');
    }
};

onMounted(() => {
    getModelList();
});

const selectedModel = ref<number>(0);

// 确认选择
const handleSelect = () => {
    if (!selectedModel.value) {
        ElMessage.error('请选择一个模型');
        return;
    }
    const model = modelList.value.find((item) => item.id === selectedModel.value);
    emit('select', model);
    handleClose();
};
</script>
<style scoped lang="scss">
@import '../styles/mixin.scss';
.title {
    @include textOverflow;
    font-size: 20px;
    font-weight: bold;
    width: 180px;
}
.el-card {
    margin-bottom: 10px;
    margin-right: 10px;
}
.url {
    margin-left: 20px;
}
</style>
