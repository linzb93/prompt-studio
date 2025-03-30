<template>
    <div>
        <!-- 返回按钮 -->
        <el-button @click="router.back()" class="back-button">
            <el-icon><Back /></el-icon>返回上一页
        </el-button>
        <div class="compare-container">
            <div class="history-item">
                <div class="detail-content">
                    <div class="flexalign-center">
                        <h3 class="flexitem-1">{{ currentHistory.title }}</h3>
                        <div class="flexalign-center">
                            <el-dropdown @command="handlePropShow">
                                <span class="dropdown-link curp">
                                    {{ propShowDropdownItems.find((item) => item.command === visibleKey)?.label }}
                                    <el-icon><ArrowDown /></el-icon>
                                </span>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item
                                            v-for="item in propShowDropdownItems"
                                            :key="item.command"
                                            :command="item.command"
                                            >{{ item.label }}</el-dropdown-item
                                        >
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                        </div>
                    </div>
                    <template v-if="isShow('modelId')">
                        <div class="label">选择的模型</div>
                        <div class="text-content">{{ currentHistory.modelName }}</div>
                    </template>
                    <template v-if="isShow('systemPrompt')">
                        <div class="label">系统提示词</div>
                        <div class="text-content whitespace-pre-wrap">{{ currentHistory.systemPrompt }}</div>
                    </template>
                    <template v-if="isShow('userPrompt')">
                        <div class="label">用户提示词</div>
                        <div class="text-content whitespace-pre-wrap">{{ currentHistory.userPrompt }}</div>
                    </template>
                    <div class="label">AI响应</div>
                    <div class="text-content whitespace-pre-wrap">
                        <div class="ai-response-cont" v-html="currentHistory.aiResponse"></div>
                    </div>
                </div>
            </div>
            <div class="history-item">
                <div class="detail-content" v-if="compareHistory.id">
                    <h3>{{ compareHistory.title }}</h3>
                    <template v-if="isShow('modelId')">
                        <div class="label">选择的模型</div>
                        <div class="text-content">{{ compareHistory.modelName }}</div>
                    </template>
                    <template v-if="isShow('systemPrompt')">
                        <div class="label">系统提示词</div>
                        <div class="text-content whitespace-pre-wrap">{{ compareHistory.systemPrompt }}</div>
                    </template>
                    <template v-if="isShow('userPrompt')">
                        <div class="label">用户提示词</div>
                        <div class="text-content whitespace-pre-wrap">{{ compareHistory.userPrompt }}</div>
                    </template>
                    <div class="label">AI响应</div>
                    <div class="text-content whitespace-pre-wrap">
                        <div class="ai-response-cont" v-html="compareHistory.aiResponse"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, shallowRef, shallowReadonly } from 'vue';
import { ElMessage } from 'element-plus';
import request from '@/shared/request';
import { useRoute, useRouter } from 'vue-router';
import { ArrowDown, Back } from '@element-plus/icons-vue';
import markdown from 'markdown-it';
interface HistoryItem {
    id: number;
    title: string;
    themeId: number;
    modelId: number;
    systemPrompt: string;
    modelName: string;
    userPrompt: string;
    aiResponse: string;
    isBest: boolean;
    createTime: string;
}

const route = useRoute();
const router = useRouter();
const currentHistoryId = ref(Number(route.query.originId));
const compareHistoryId = ref(Number(route.query.compareId));
const themeId = Number(route.query.themeId);

const currentHistory = ref<HistoryItem>({
    id: 0,
    title: '',
    themeId: 0,
    modelId: 0,
    modelName: '',
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
    modelName: '',
    systemPrompt: '',
    userPrompt: '',
    aiResponse: '',
    isBest: false,
    createTime: '',
});

const historyList = ref<HistoryItem[]>([]);
const md = markdown();
/**
 * 加载当前历史记录和对比历史记录的详情
 * @async
 * @returns {Promise<void>}
 * @throws {Error} 当获取历史记录详情失败时抛出错误
 */
const loadCurrentHistory = async () => {
    try {
        const pairs = await Promise.all([
            request('history-get-detail', { id: currentHistoryId.value, themeId }),
            request('history-get-detail', { id: compareHistoryId.value, themeId }),
        ]);
        currentHistory.value = {
            ...pairs[0],
            aiResponse: md.render(pairs[0].aiResponse),
        };
        compareHistory.value = {
            ...pairs[1],
            aiResponse: md.render(pairs[1].aiResponse),
        };
    } catch (error) {
        ElMessage.error('获取历史记录详情失败');
    }
};

/**
 * 加载历史记录列表
 * @async
 * @returns {Promise<void>}
 * @throws {Error} 当加载历史记录列表失败时抛出错误
 */
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

/**
 * 处理对比历史记录变化
 * @async
 * @param {number} id - 要对比的历史记录ID
 * @returns {Promise<void>}
 * @throws {Error} 当获取历史记录详情失败时抛出错误
 */
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

const handlePropShow = (cmd: string) => {
    visibleKey.value = cmd;
};
const propShowDropdownItems = shallowReadonly([
    {
        label: '只显示标题',
        command: 'title',
    },
    {
        label: '只显示差异项',
        command: 'different',
    },
    {
        label: '显示全部',
        command: 'all',
    },
]);

const visibleKey = shallowRef('all');

const isShow = (prop: string) => {
    if (visibleKey.value === 'title') {
        return prop === 'title';
    } else if (visibleKey.value === 'different') {
        //@ts-ignore
        console.log(currentHistory.value, prop);
        //@ts-ignore
        return currentHistory.value[prop] !== compareHistory.value[prop];
    } else if (visibleKey.value === 'all') {
        return true;
    }
};
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
    background-color: #fdfdfd;
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
.dropdown-link {
    color: #409eff;
}
</style>
