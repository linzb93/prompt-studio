<template>
    <!-- 主模型管理弹窗 -->
    <el-dialog :model-value="modelValue" title="模型管理" width="80%" :before-close="handleClose">
        <el-space direction="vertical" fill class="w-100">
            <!-- 添加按钮 -->
            <el-row>
                <el-col :span="24">
                    <el-button type="primary" @click="handleAdd">
                        <el-icon class="mr-2"><Plus /></el-icon>添加模型
                    </el-button>
                </el-col>
            </el-row>

            <!-- 模型列表 -->
            <el-row>
                <el-col :span="24">
                    <el-table :data="modelList" height="500px" v-loading="loading">
                        <el-table-column prop="name" label="模型名称" />
                        <el-table-column prop="url" label="API地址" show-overflow-tooltip />
                        <el-table-column label="操作" width="200" fixed="right">
                            <template #default="{ row }">
                                <el-button-group>
                                    <el-button type="primary" @click="handleEdit(row)">编辑</el-button>
                                    <el-button type="danger" @click="handleDelete(row)">删除</el-button>
                                </el-button-group>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
        </el-space>
    </el-dialog>

    <!-- 添加/编辑模型弹窗 -->
    <el-dialog
        v-if="formDialogVisible"
        v-model="formDialogVisible"
        :title="currentModel ? '编辑模型' : '添加模型'"
        width="50%"
    >
        <el-form :model="modelForm" label-width="100px">
            <el-form-item label="模型名称" required>
                <el-input v-model="modelForm.name" placeholder="请输入模型名称" />
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
}

const props = defineProps<{
    modelValue: boolean;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
}>();

const loading = ref(false);
const modelList = ref<Model[]>([]);
const formDialogVisible = ref(false);
const currentModel = ref<Model | null>(null);
const modelForm = ref<Omit<Model, 'id'>>({ name: '', url: '', apiKey: '' });

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
    modelForm.value = { name: '', url: '', apiKey: '' };
    formDialogVisible.value = true;
};

// 编辑模型
const handleEdit = (model: Model) => {
    currentModel.value = model;
    modelForm.value = { name: model.name, url: model.url, apiKey: model.apiKey };
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
</script>
