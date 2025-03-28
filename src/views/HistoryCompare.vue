<template>
    <div>
        <!-- 返回按钮 -->
        <el-button @click="router.back()" class="back-button">
            <el-icon><Back /></el-icon>返回上一页
        </el-button>
        <div class="compare-container">
            <div class="history-item">
                <h3>当前历史记录</h3>
                <div class="detail-content">
                    <div class="label">标题</div>
                    <div class="text-content">{{ currentHistory.title }}</div>
                    <div class="label">选择的模型</div>
                    <div class="text-content">{{ currentHistory.modelId || '未指定' }}</div>
                    <div class="label">系统提示词</div>
                    <div class="text-content whitespace-pre-wrap">{{ currentHistory.systemPrompt }}</div>
                    <div class="label">用户提示词</div>
                    <div class="text-content whitespace-pre-wrap">{{ currentHistory.userPrompt }}</div>
                    <div class="label">AI响应</div>
                    <div class="text-content whitespace-pre-wrap">{{ currentHistory.aiResponse }}</div>
                </div>
            </div>
            <div class="history-item">
                <h3>对比历史记录</h3>
                <div class="select-container">
                    <el-select
                        v-model="compareHistoryId"
                        placeholder="选择要对比的历史记录"
                        @change="handleCompareChange"
                    >
                        <el-option v-for="item in historyList" :key="item.id" :label="item.title" :value="item.id" />
                    </el-select>
                </div>
                <div class="detail-content" v-if="compareHistory.id">
                    <div class="label">标题</div>
                    <div class="text-content">{{ compareHistory.title }}</div>
                    <div class="label">选择的模型</div>
                    <div class="text-content">{{ compareHistory.modelId || '未指定' }}</div>
                    <div class="label">系统提示词</div>
                    <div class="text-content whitespace-pre-wrap">{{ compareHistory.systemPrompt }}</div>
                    <div class="label">用户提示词</div>
                    <div class="text-content whitespace-pre-wrap">{{ compareHistory.userPrompt }}</div>
                    <div class="label">AI响应</div>
                    <div class="text-content whitespace-pre-wrap">{{ compareHistory.aiResponse }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import request from '@/shared/request';
import { useRoute, useRouter } from 'vue-router';
import { Back } from '@element-plus/icons-vue';

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

const route = useRoute();
const router = useRouter();
const currentHistoryId = ref(Number(route.params.id));
const compareHistoryId = ref(0);

const currentHistory = ref<HistoryItem>({
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

const compareHistory = ref<HistoryItem>({
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

const historyList = ref<HistoryItem[]>([]);
// 加载当前历史记录详情
const loadCurrentHistory = async () => {
    try {
        const pairs = await Promise.all([
            request('history-get-detail', { id: currentHistoryId.value }),
            request('history-get-detail', { id: compareHistoryId.value }),
        ]);
        currentHistory.value = pairs[0];
        compareHistory.value = pairs[1];
    } catch (error) {
        ElMessage.error('获取历史记录详情失败');
    }
};

// 加载历史记录列表
const loadHistoryList = async () => {
    try {
        const list = await request('history-get-list', {
            pageIndex: 1,
            pageSize: 100,
            themeId: currentHistory.value.themeId,
        });
        // 过滤掉当前历史记录
        historyList.value = list.filter((item: HistoryItem) => item.id !== currentHistoryId.value);
    } catch (error) {
        ElMessage.error('加载历史记录列表失败');
    }
};

// 处理对比历史记录变化
const handleCompareChange = async (id: number) => {
    try {
        const detail = await request('history-get-detail', { id });
        compareHistory.value = detail;
    } catch (error) {
        ElMessage.error('获取历史记录详情失败');
    }
};

onMounted(() => {
    loadCurrentHistory();
});
</script>

<style scoped lang="scss">
.compare-container {
    display: flex;
    gap: 20px;
    padding: 20px;
}

.history-item {
    flex: 1;
    h3 {
        margin-bottom: 20px;
        font-size: 18px;
    }
}

.select-container {
    margin-bottom: 20px;
}

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

.detail-content {
    padding: 20px;
    border: 1px solid #eee;
    border-radius: 8px;
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
