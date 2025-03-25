<template>
    <!-- 主模型管理弹窗 -->
    <el-dialog :model-value="modelValue" title="模型管理" width="750px" :before-close="handleClose">
        <el-space fill>
            <!-- 添加按钮 -->
            <el-row>
                <el-col>
                    <el-button type="primary" @click="handleAdd">
                        <el-icon><Plus /></el-icon>添加模型
                    </el-button>
                </el-col>
            </el-row>

            <!-- 模型列表 -->
            <el-row>
                <el-radio-group v-model="selectedModel">
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
        :title="currentModel ? '编辑模型' : '添加模型'"
        width="400px"
    >
        <el-form :model="modelForm" label-width="100px">
            <el-form-item label="模型名称" required>
                <el-input v-model="modelForm.name" placeholder="请输入模型名称" />
            </el-form-item>
            <el-form-item label="model" required>
                <el-input v-model="modelForm.model" placeholder="请输入模型model" />
            </el-form-item>
            <el-form-item label="API地址" required>
                <el-input v-model="modelForm.url" placeholder="请输入API地址" />
            </el-form-item>
            <el-form-item label="API Key" required>
                <el-input v-model="modelForm.apiKey" type="password" placeholder="请输入API Key" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="formDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleSubmit">确定</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Plus } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import request from '@/shared/request';

interface Model {
    id: number;
    name: string;
    url: string;
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

// 编辑模型
const handleEdit = (model: Model) => {
    currentModel.value = model;
    modelForm.value = { name: model.name, model: model.model, url: model.url, apiKey: model.apiKey };
    formDialogVisible.value = true;
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
        if (currentModel.value) {
            await request('model-update', {
                id: currentModel.value.id,
                ...modelForm.value,
            });
            ElMessage.success('编辑成功');
        } else {
            await request('model-create', modelForm.value);
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
        ElMessage.warning('请选择一个模型');
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
