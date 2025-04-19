<template>
    <!-- 附件管理弹窗 -->
    <el-dialog
        :model-value="modelValue"
        title="附件管理"
        width="780px"
        :close-on-click-modal="false"
        :before-close="handleClose"
    >
        <el-space fill class="full-width" v-if="!loading">
            <!-- 附件列表 -->
            <el-row>
                <div class="flexalign-center flex-wrap">
                    <div v-for="attachment in attachmentList" :key="attachment.id" class="attachment-item">
                        <div class="attachment-thumbnail">
                            <el-image
                                v-if="isImage(attachment.name)"
                                :src="attachment.url"
                                fit="cover"
                                class="thumbnail-size"
                            />
                            <el-icon v-else class="thumbnail-size">
                                <Document />
                            </el-icon>
                        </div>
                        <div class="attachment-name">
                            {{ attachment.name }}
                        </div>
                        <el-button class="delete-btn" type="danger" size="small" @click="handleDelete(attachment)">
                            删除
                        </el-button>
                    </div>
                </div>
            </el-row>

            <!-- 分页 -->
            <el-row>
                <el-pagination
                    small
                    layout="prev, pager, next"
                    :total="total"
                    :page-size="pageSize"
                    @current-change="handlePageChange"
                />
            </el-row>
        </el-space>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Document } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import request from '@/shared/request';

interface Attachment {
    id: number;
    name: string;
    url: string;
}

const props = defineProps<{
    modelValue: boolean;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
    (e: 'close'): void;
}>();

const loading = ref(false);
const attachmentList = ref<Attachment[]>([]);
const total = ref(0);
const pageSize = ref(20);
const currentPage = ref(1);

// 获取附件列表
const getAttachmentList = async () => {
    loading.value = true;
    try {
        const data = await request('attachment-get-list', {
            pageIndex: currentPage.value,
            pageSize: pageSize.value,
        });
        attachmentList.value = data.data || [];
        total.value = data.total || 0;
    } catch (error) {
        ElMessage.error('获取附件列表失败');
    } finally {
        loading.value = false;
    }
};

// 判断是否为图片
const isImage = (name: string) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const extension = name.split('.').pop()?.toLowerCase();
    return extension && imageExtensions.includes(extension);
};

// 删除附件
const handleDelete = async (attachment: Attachment) => {
    try {
        await ElMessageBox.confirm('确定要删除这个附件吗？', '删除确认', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        });
        await request('attachment-delete', { id: attachment.id });
        ElMessage.success('删除成功');
        getAttachmentList();
    } catch (error) {
        if (error !== 'cancel') {
            ElMessage.error('删除失败');
        }
    }
};

// 分页变化
const handlePageChange = (page: number) => {
    currentPage.value = page;
    getAttachmentList();
};

// 关闭弹窗
const handleClose = () => {
    emit('update:modelValue', false);
    emit('close');
};

watch(props, ({ modelValue }) => {
    if (!modelValue) {
        return;
    }
    getAttachmentList();
});
</script>

<style scoped lang="scss">
.attachment-item {
    position: relative;
    width: 50px;
    height: 50px;
    margin: 0 10px 10px 0;
    display: inline-block;

    .attachment-thumbnail {
        width: 50px;
        height: 50px;
        border-radius: 4px;
        overflow: hidden;
    }

    .thumbnail-size {
        width: 50px;
        height: 50px;
    }

    .attachment-name {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 2px;
        font-size: 10px;
        color: white;
        background-color: rgba(0, 0, 0, 0.5);
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .delete-btn {
        position: absolute;
        top: -10px;
        right: -10px;
        width: 20px;
        height: 20px;
        padding: 0;
        border-radius: 50%;
    }
}
</style>
