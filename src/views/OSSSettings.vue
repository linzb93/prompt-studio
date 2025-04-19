<template>
    <div class="oss-settings-container">
        <div class="header-section">
            <el-button @click="router.back()" icon="ArrowLeft">返回首页</el-button>
            <h2>OSS 设置</h2>
        </div>
        <el-form :model="form" label-width="220px">
            <el-form-item label="AccessKey ID" required>
                <el-input v-model="form.accessKeyId" placeholder="请输入AccessKey ID" />
            </el-form-item>
            <el-form-item label="AccessKey Secret" required>
                <el-input
                    v-model="form.accessKeySecret"
                    type="password"
                    placeholder="请输入AccessKey Secret"
                    show-password
                />
            </el-form-item>
            <el-form-item label="Region" required>
                <el-input v-model="form.region" placeholder="请输入Region，如：oss-cn-hangzhou" />
            </el-form-item>
            <el-form-item label="Bucket" required>
                <div class="bucket-input">
                    <el-select
                        v-model="form.bucket"
                        placeholder="请选择Bucket"
                        style="width: 100%"
                        v-if="showBucketSelect"
                    >
                        <el-option v-for="bucket in buckets" :key="bucket" :label="bucket" :value="bucket" />
                    </el-select>
                    <el-button type="primary" @click="getBuckets" :loading="loading">获取</el-button>
                </div>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="saveSettings" :loading="saving">保存设置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { ArrowLeft } from '@element-plus/icons-vue';
import request from '@/shared/request';

const router = useRouter();
interface OSSForm {
    accessKeyId: string;
    accessKeySecret: string;
    region: string;
    bucket: string;
}

const form = reactive<OSSForm>({
    accessKeyId: '',
    accessKeySecret: '',
    region: '',
    bucket: '',
});

const buckets = ref<string[]>([]);
const loading = ref(false);
const saving = ref(false);
const showBucketSelect = ref(false);

// 获取bucket列表
const getBuckets = async () => {
    if (!form.accessKeyId || !form.accessKeySecret || !form.region) {
        ElMessage.warning('请先填写AccessKey ID、AccessKey Secret和Region');
        return;
    }

    loading.value = true;
    try {
        const bucketsList = await request('oss-list-buckets', {
            accessKeyId: form.accessKeyId,
            accessKeySecret: form.accessKeySecret,
            region: form.region,
        });
        if (bucketsList) {
            buckets.value = bucketsList;
            showBucketSelect.value = true;
            ElMessage.success('获取Bucket列表成功');
        }
    } catch (error) {
        ElMessage.error('获取Bucket列表失败');
    } finally {
        loading.value = false;
    }
};

// 保存设置
const saveSettings = async () => {
    if (!form.accessKeyId || !form.accessKeySecret || !form.region || !form.bucket) {
        ElMessage.warning('请填写完整的OSS配置信息');
        return;
    }

    saving.value = true;
    try {
        const data = await request('oss-add-account', {
            accessKeyId: form.accessKeyId,
            accessKeySecret: form.accessKeySecret,
            region: form.region,
            bucket: form.bucket,
        });
        if (data) {
            ElMessage.success('保存成功');
        }
    } catch (error) {
        ElMessage.error('保存失败');
    } finally {
        saving.value = false;
    }
};
</script>

<style scoped>
.oss-settings-container {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
}

.bucket-input {
    display: flex;
    gap: 10px;
}

.bucket-input .el-select {
    flex: 1;
}

.header-section {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 20px;
}

.header-section h2 {
    margin: 0;
}
</style>
