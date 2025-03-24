<template>
    <el-dialog :model-value="modelValue" title="历史记录" width="80%" :before-close="handleClose">
        <div class="flex flex-col h-[600px]">
            <!-- 搜索栏 -->
            <div class="mb-4">
                <el-input v-model="keyword" placeholder="搜索历史记录..." class="w-60" @keyup.enter="handleSearch">
                    <template #prefix>
                        <el-icon><Search /></el-icon>
                    </template>
                </el-input>
            </div>

            <!-- 历史记录列表 -->
            <el-table :data="historyList" style="flex: 1" v-loading="loading">
                <el-table-column prop="title" label="标题">
                    <template #default="{ row }">
                        <div class="flex items-center gap-2">
                            {{ row.title }}
                            <el-tag v-if="row.isBest" type="success" size="small" effect="plain">最佳</el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="180" />
                <el-table-column label="操作" width="200" fixed="right">
                    <template #default="{ row }">
                        <el-button-group>
                            <el-button type="primary" :icon="View" @click="handleViewDetail(row)" />
                            <el-button type="success" :icon="Select" @click="handleApply(row)" />
                            <el-button
                                :type="row.isBest ? 'warning' : 'info'"
                                :icon="Star"
                                @click="handleMarkBest(row)"
                            />
                            <el-button type="danger" :icon="Delete" @click="handleDelete(row)" />
                        </el-button-group>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 历史记录详情弹窗 -->
        <el-dialog v-model="detailVisible" title="历史记录详情" width="60%" append-to-body>
            <div class="space-y-4">
                <div>
                    <div class="text-sm font-medium text-gray-700 mb-2">系统提示词</div>
                    <el-input type="textarea" v-model="currentDetail.systemPrompt" rows="4" readonly />
                </div>
                <div>
                    <div class="text-sm font-medium text-gray-700 mb-2">用户提示词</div>
                    <el-input type="textarea" v-model="currentDetail.userPrompt" rows="4" readonly />
                </div>
                <div>
                    <div class="text-sm font-medium text-gray-700 mb-2">AI响应</div>
                    <el-input type="textarea" v-model="currentDetail.aiResponse" rows="4" readonly />
                </div>
            </div>
        </el-dialog>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { View, Select, Star, Delete, Search } from '@element-plus/icons-vue';
import { ipcRenderer } from 'electron';

interface HistoryItem {
    id: number;
    title: string;
    themeId: number;
    modelId: number;
    systemPrompt: string;
    userPrompt: string;
    aiResponse: string;
    isBest: boolean;
    createTime: string;
}

const props = defineProps<{
    themeId: number;
    modelId?: number;
    modelValue: boolean;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
    (e: 'apply', history: HistoryItem): void;
}>();

const detailVisible = ref(false);
const loading = ref(false);
const keyword = ref('');
const historyList = ref<HistoryItem[]>([]);
const currentDetail = ref<HistoryItem>({
    id: 0,
    title: '',
    themeId: 0,
    modelId: 0,
    systemPrompt: '',
    userPrompt: '',
    aiResponse: '',
    isBest: false,
    createTime: '',
});

// 加载历史记录列表
const loadHistoryList = async () => {
    loading.value = true;
    try {
        const list = await ipcRenderer.invoke('history-get-list', {
            pageIndex: 1,
            pageSize: 100,
            themeId: props.themeId,
            modelId: props.modelId,
            keyword: keyword.value,
        });
        historyList.value = list;
    } catch (error) {
        ElMessage.error('加载历史记录失败');
    } finally {
        loading.value = false;
    }
};

// 搜索历史记录
const handleSearch = () => {
    loadHistoryList();
};

// 查看历史记录详情
const handleViewDetail = async (row: HistoryItem) => {
    try {
        const detail = await ipcRenderer.invoke('history-get-detail', { id: row.id });
        currentDetail.value = detail;
        detailVisible.value = true;
    } catch (error) {
        ElMessage.error('获取历史记录详情失败');
    }
};

// 应用历史记录
const handleApply = (row: HistoryItem) => {
    emit('apply', row);
    emit('update:modelValue', false);
};

// 标记为最佳记录
const handleMarkBest = async (row: HistoryItem) => {
    try {
        await ipcRenderer.invoke('history-mark-best', {
            id: row.id,
            isBest: !row.isBest,
        });
        await loadHistoryList();
        ElMessage.success(row.isBest ? '取消标记成功' : '标记成功');
    } catch (error) {
        ElMessage.error('操作失败');
    }
};

// 删除历史记录
const handleDelete = async (row: HistoryItem) => {
    try {
        await ElMessageBox.confirm('确认删除该历史记录？', '提示', {
            type: 'warning',
        });
        await ipcRenderer.invoke('history-delete', { id: row.id });
        await loadHistoryList();
        ElMessage.success('删除成功');
    } catch (error) {
        if (error !== 'cancel') {
            ElMessage.error('删除失败');
        }
    }
};

// 关闭弹窗
const handleClose = () => {
    emit('update:modelValue', false);
};

// 加载历史记录
defineExpose({
    loadHistoryList,
});

// 监听弹窗显示状态
defineExpose({
    showDialog: () => {
        dialogVisible.value = true;
        loadHistoryList();
    },
});
</script>
