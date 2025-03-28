<template>
    <div>
        <!-- 返回按钮 -->
        <el-button @click="router.back()" class="back-button">
            <el-icon><Back /></el-icon>返回上一页
        </el-button>
        <!-- 搜索栏 -->
        <div>
            <el-input v-model="keyword" placeholder="搜索历史记录..." class="w-60" @keyup.enter="handleSearch">
                <template #prefix>
                    <el-icon><Search /></el-icon>
                </template>
            </el-input>
        </div>
        <div class="compare-line dz-flex" v-if="isCompareMode">
            <p>
                请选择与<strong>【{{ originItem?.title }}】</strong>对比的记录
            </p>
            <el-button type="primary" size="mini" @click="isCompareMode = false">退出对比</el-button>
        </div>

        <!-- 历史记录列表 -->
        <div class="history-list flex flex-wrap mt20">
            <el-card
                v-for="history in historyList"
                :key="history.id"
                class="history-card"
                @click="selectCompareItem(history)"
            >
                <div class="card-header flexalign-center">
                    <div class="flexitem-1 title-wrap">
                        <h3 class="history-title">{{ history.title }}</h3>
                        <el-icon color="#E6A23C" :size="18" class="icon-star" v-if="history.isBest"
                            ><StarFilled
                        /></el-icon>
                    </div>
                    <div class="action-buttons" v-if="!isCompareMode">
                        <el-icon class="curp" title="查看详情" @click="handleViewDetail(history)"><View /></el-icon>
                        <el-icon class="curp ml5" title="应用" @click="handleApply(history)"><Select /></el-icon>
                        <el-dropdown class="ml5" trigger="hover" @command="(cmd:string) => handleMore(history, cmd)">
                            <el-icon title="查看更多" class="curp"><More /></el-icon>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item command="markBest">标记为最佳</el-dropdown-item>
                                    <el-dropdown-item command="delete">删除</el-dropdown-item>
                                    <el-dropdown-item command="compare">历史对比</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>
                </div>
                <div class="create-time">创建时间：{{ history.createTime }}</div>
                <div class="system-prompt">系统提示词：{{ history.systemPrompt }}</div>
                <div class="user-prompt">用户提示词：{{ history.userPrompt }}</div>
            </el-card>
        </div>

        <!-- 分页组件 -->
        <el-pagination
            background
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :total="total"
            layout="prev, pager, next, jumper"
            @current-change="handlePageChange"
        />

        <!-- 历史记录详情弹窗 -->
        <el-dialog v-model="detailVisible" title="历史记录详情" width="760px">
            <div>
                <div>
                    <div class="label">标题</div>
                    <div class="text-content">{{ currentDetail.title }}</div>
                </div>
                <div>
                    <div class="label">选择的模型</div>
                    <div class="text-content">{{ currentDetail.title || '未指定' }}</div>
                </div>
                <div>
                    <div class="label">系统提示词</div>
                    <div class="text-content whitespace-pre-wrap">{{ currentDetail.systemPrompt }}</div>
                </div>
                <div>
                    <div class="label">用户提示词</div>
                    <div class="text-content whitespace-pre-wrap">{{ currentDetail.userPrompt }}</div>
                </div>
                <div>
                    <div class="label">AI响应</div>
                    <div class="text-content whitespace-pre-wrap">{{ currentDetail.aiResponse }}</div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, shallowRef, watch } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { View, Select, StarFilled, Search, More, Back } from '@element-plus/icons-vue';
import request from '@/shared/request';
import { useRouter, useRoute } from 'vue-router';

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

const router = useRouter();
const route = useRoute();
const themeId = ref(Number(route.query.id));

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

const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 加载历史记录列表
const loadHistoryList = async () => {
    loading.value = true;
    try {
        const list = await request('history-get-list', {
            pageIndex: currentPage.value,
            pageSize: pageSize.value,
            themeId: themeId.value,
            keyword: keyword.value,
        });
        historyList.value = list;
    } catch (error) {
        ElMessage.error('加载历史记录失败');
    } finally {
        loading.value = false;
    }
};

// 处理页码变化
const handlePageChange = (page: number) => {
    currentPage.value = page;
    loadHistoryList();
};

// 搜索历史记录
const handleSearch = () => {
    currentPage.value = 1;
    loadHistoryList();
};

// 查看历史记录详情
const handleViewDetail = async (row: HistoryItem) => {
    try {
        const detail = await request('history-get-detail', { id: row.id });
        currentDetail.value = detail;
        detailVisible.value = true;
    } catch (error) {
        ElMessage.error('获取历史记录详情失败');
    }
};

// 应用历史记录
const handleApply = async (row: HistoryItem) => {
    await request('history-apply', { id: row.id });
    ElMessage.success('应用成功');
    router.push({
        path: '/theme/detail',
        query: { id: row.themeId },
    });
};

const handleMore = async (row: HistoryItem, cmd: string) => {
    if (cmd === 'markBest') {
        handleMarkBest(row);
    } else if (cmd === 'delete') {
        handleDelete(row);
    } else if (cmd === 'compare') {
        selectOriginItem(row);
    }
};
const originItem = ref<HistoryItem>();
const isCompareMode = shallowRef(false);
const selectOriginItem = (row: HistoryItem) => {
    originItem.value = row;
    isCompareMode.value = true;
};
watch(isCompareMode, (newVal) => {
    if (newVal) {
        currentPage.value = 1;
        loadHistoryList();
    } else {
        originItem.value = undefined;
    }
});
const selectCompareItem = (row: HistoryItem) => {
    if (!isCompareMode.value) {
        return;
    }
    router.push({
        path: '/history/compare',
        query: {
            originId: originItem.value?.id,
            compareId: row.id,
        },
    });
};

// 标记为最佳记录
const handleMarkBest = async (row: HistoryItem) => {
    try {
        await request('history-mark-best', {
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
            confirmButtonText: '确定',
            cancelButtonText: '取消',
        });
        await request('history-delete', { id: row.id });
        await loadHistoryList();
        ElMessage.success('删除成功');
    } catch (error) {
        if (error !== 'cancel') {
            ElMessage.error('删除失败');
        }
    }
};

onMounted(() => {
    loadHistoryList();
});
</script>

<style scoped lang="scss">
@import '../styles/mixin.scss';
.label {
    font-weight: bold;
    margin-bottom: 5px;
}
.text-content {
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
}
.title-wrap {
    position: relative;
}
.icon-star {
    position: absolute;
    top: 2px;
    left: -16px;
}
.history-card {
    margin-bottom: 10px;
    margin-right: 20px;
    margin-top: 0;
    width: 353px;
    &:nth-child(2n) {
        margin-right: 0;
    }
}
.history-title {
    @include textOverflow;
    width: 220px;
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
}
.create-time {
    font-size: 12px;
    color: #999;
    margin-bottom: 10px;
}
.system-prompt,
.user-prompt {
    @include textOverflow;
    margin-bottom: 5px;
}
.user-prompt {
    color: #999;
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
