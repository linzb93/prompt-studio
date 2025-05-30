<template>
    <div class="home-container" v-if="loaded">
        <!-- 顶部操作栏 -->
        <div class="top-bar" v-if="themes.length">
            <el-input
                v-model="keyword"
                placeholder="搜索主题..."
                class="search-input"
                :prefix-icon="Search"
                @keypress.stop.prevent.enter="handleSearch"
            />
            <el-button type="primary" @click="handleCreate">
                <el-icon class="mr-2"><Plus /></el-icon>新建主题
            </el-button>
        </div>

        <!-- 主题列表 -->
        <div class="theme-list" v-if="themes.length">
            <el-card v-for="theme in themes" :key="theme.id" class="theme-card">
                <div class="card-header">
                    <h3 class="theme-title">{{ theme.name }}</h3>
                    <div class="action-buttons">
                        <el-icon title="编辑" class="curp" @click="handleEdit(theme)"><Edit /></el-icon>
                        <el-icon title="删除" color="#F56C6C" class="curp" @click="handleDelete(theme)"
                            ><Delete
                        /></el-icon>
                        <el-dropdown trigger="hover" @command="(cmd:string) => handleMore(theme, cmd)">
                            <el-icon class="curp"><More /></el-icon>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item command="history"> 历史记录 </el-dropdown-item>
                                    <el-dropdown-item command="rename"> 重命名 </el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>
                </div>
                <div class="create-time">创建时间：{{ theme.createTime }}</div>
            </el-card>
        </div>
        <!-- 空状态 -->
        <el-empty v-else :description="emptyText">
            <el-button type="primary" @click="handleCreate">添加场景</el-button>
        </el-empty>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, shallowRef } from 'vue';
import { useRouter } from 'vue-router';
import { Search, Plus, Edit, Delete, More } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import request from '@/shared/request';

interface Theme {
    id: number;
    name: string;
    createTime: string;
}

const router = useRouter();

// 搜索和分页
const keyword = ref('');
const themes = ref<Theme[]>([]);

const emptyText = shallowRef('');
const loaded = shallowRef(false);

// 获取主题列表
const getThemes = async () => {
    try {
        const data = await request('theme-get-list', {
            keyword: keyword.value,
        });
        loaded.value = true;
        themes.value = data;
        if (!data.length) {
            if (keyword.value === '') {
                emptyText.value = '创建你的第一个主题吧！';
            } else {
                emptyText.value = '没有找到相关主题';
            }
        }
    } catch (error) {
        console.log(error);
        ElMessage.error('获取主题列表失败');
    }
};

// 搜索处理
const handleSearch = () => {
    getThemes();
};

// 新建主题
const handleCreate = () => {
    router.push('/theme/create');
};

// 编辑主题
const handleEdit = (theme: Theme) => {
    router.push({
        path: '/theme/detail',
        query: { id: theme.id },
    });
};

// 查看历史
const handleHistory = (theme: Theme) => {
    router.push({
        path: '/theme/history',
        query: { id: theme.id },
    });
};

// 删除主题
const handleDelete = async (theme: Theme) => {
    try {
        await ElMessageBox.confirm('确定要删除这个主题吗？', '温馨提醒', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        });
        await request('theme-delete', { id: theme.id });
        ElMessage.success('删除成功');
        getThemes();
    } catch (error) {
        if (error !== 'cancel') {
            ElMessage.error('删除失败');
        }
    }
};

const handleMore = (theme: Theme, cmd: string) => {
    if (cmd === 'history') {
        handleHistory(theme);
    } else if (cmd === 'rename') {
        handleRename(theme);
    }
};
// 弹出element-plus的输入框
const handleRename = (theme: Theme) => {
    ElMessageBox.prompt('请输入新的主题名称', '温馨提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: theme.name,
        inputType: 'text',
        inputValidator: (value: string) => {
            if (!value) {
                return '请输入主题名称';
            }
            return true;
        },
    })
        .then(({ value }) => {
            request('theme-rename', { id: theme.id, name: value })
                .then(() => {
                    ElMessage.success('重命名成功');
                    getThemes();
                })
                .catch(() => {
                    ElMessage.error('重命名失败');
                });
        })
        .catch(() => {
            // 用户取消操作
        });
};

onMounted(() => {
    getThemes();
});
</script>

<style scoped>
.home-container {
    padding: 20px;
}

.top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.search-input {
    max-width: 300px;
}

.theme-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-bottom: 20px;
}

.theme-card {
    transition: box-shadow 0.3s ease;
}

.theme-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
}

.theme-title {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    cursor: pointer;
}

.theme-title:hover {
    color: var(--el-color-primary);
}

.action-buttons {
    display: flex;
    gap: 8px;
}

.create-time {
    font-size: 13px;
    color: var(--el-text-color-secondary);
}

.pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}
</style>
