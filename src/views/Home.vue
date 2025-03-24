<template>
    <div class="home-container">
        <!-- 顶部操作栏 -->
        <div class="top-bar">
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
        <div class="theme-list">
            <el-card v-for="theme in themes" :key="theme.id" class="theme-card">
                <div class="card-header">
                    <h3 class="theme-title" @click="handleDetail(theme)">{{ theme.name }}</h3>
                    <div class="action-buttons">
                        <el-icon class="curp" @click="handleEdit(theme)"><Edit /></el-icon>

                        <el-icon class="curp" @click="handleHistory(theme)"><Timer /></el-icon>

                        <el-icon class="curp" @click="handleDelete(theme)"><Delete /></el-icon>
                    </div>
                </div>
                <div class="create-time">创建时间：{{ theme.createTime }}</div>
            </el-card>
        </div>

        <!-- 新建/编辑主题对话框 -->
        <el-dialog v-model="dialogVisible" :title="dialogType === 'create' ? '新建主题' : '编辑主题'" width="30%">
            <el-form :model="form" label-width="80px">
                <el-form-item label="主题名称" required>
                    <el-input v-model="form.name" placeholder="请输入主题名称" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleSubmit">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Search, Plus, Edit, Timer, Delete } from '@element-plus/icons-vue';
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

// 对话框控制
const dialogVisible = ref(false);
const dialogType = ref<'create' | 'edit'>('create');
const currentTheme = ref<Theme | null>(null);

// 表单数据
const form = ref({
    id: 0,
    name: '',
});

// 获取主题列表
const getThemes = async () => {
    try {
        const data = await request('theme-get-list', {
            keyword: keyword.value,
        });
        themes.value = data;
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
    dialogType.value = 'create';
    form.value = { id: 0, name: '' };
    dialogVisible.value = true;
};

// 编辑主题
const handleEdit = (theme: Theme) => {
    dialogType.value = 'edit';
    form.value = { id: theme.id, name: theme.name };
    dialogVisible.value = true;
};

// 查看历史
const handleHistory = (theme: Theme) => {
    router.push(`/history/${theme.id}`);
};

// 查看详情
const handleDetail = (theme: Theme) => {
    router.push(`/theme/${theme.id}`);
};

// 删除主题
const handleDelete = async (theme: Theme) => {
    try {
        await ElMessageBox.confirm('确定要删除这个主题吗？', '删除确认', {
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

// 提交表单
const handleSubmit = async () => {
    if (!form.value.name.trim()) {
        ElMessage.warning('请输入主题名称');
        return;
    }

    try {
        if (dialogType.value === 'create') {
            await request('theme-create', { name: form.value.name });
            ElMessage.success('创建成功');
        } else {
            await request('theme-update', { id: form.value.id, name: form.value.name });
            ElMessage.success('更新成功');
        }
        dialogVisible.value = false;
        getThemes();
    } catch (error) {
        ElMessage.error(dialogType.value === 'create' ? '创建失败' : '更新失败');
    }
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
