<template>
    <div class="oss-settings-container">
        <el-form :model="form" :rules="rules" ref="ossForm" label-width="140px">
            <el-form-item label="AccessKey ID" prop="accessKeyId">
                <el-input v-model="form.accessKeyId" placeholder="请输入AccessKey ID" />
            </el-form-item>
            <el-form-item label="AccessKey Secret" prop="accessKeySecret">
                <el-input
                    v-model="form.accessKeySecret"
                    type="password"
                    placeholder="请输入AccessKey Secret"
                    show-password
                />
            </el-form-item>
            <el-form-item label="Region" prop="region">
                <el-input v-model="form.region" placeholder="请输入Region，如：oss-cn-hangzhou" />
            </el-form-item>
            <el-form-item label="Bucket" prop="bucket">
                <div class="bucket-input">
                    <el-select
                        v-model="form.bucket"
                        placeholder="请选择Bucket"
                        style="width: 130px"
                        v-if="showBucketSelect"
                    >
                        <el-option v-for="bucket in buckets" :key="bucket" :label="bucket" :value="bucket" />
                    </el-select>
                    <el-button type="primary" @click="getBuckets" :loading="loading">获取Bucket</el-button>
                </div>
            </el-form-item>
            <el-form-item label="目录地址" prop="directory">
                <el-input v-model="form.directory" placeholder="请输入目录地址" />
            </el-form-item>
            <el-form-item label="访问域名" prop="domain">
                <el-input v-model="form.domain" placeholder="请输入访问域名，如：https://example.com" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="saveSettings" :loading="saving">保存设置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { ref, readonly, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import request from '@/shared/request';
import { useOSSStore } from '@/store/oss';

interface OSSForm {
    accessKeyId: string;
    accessKeySecret: string;
    region: string;
    bucket: string;
    directory: string;
    domain: string;
}

interface OSSRules {
    accessKeyId: { required: boolean; message: string }[];
    accessKeySecret: { required: boolean; message: string }[];
    region: { required: boolean; message: string }[];
    bucket: { required: boolean; message: string }[];
    directory: { required: boolean; message: string }[];
    domain: { required: boolean; message: string }[];
}

const form = ref<OSSForm>({
    accessKeyId: '',
    accessKeySecret: '',
    region: '',
    bucket: '',
    directory: '',
    domain: '',
});

const buckets = ref<string[]>([]);
const loading = ref(false);
const saving = ref(false);
const showBucketSelect = ref(false);
const ossForm = ref();

onMounted(async () => {
    form.value = await request('oss-get-config');
    showBucketSelect.value = form.value && !!form.value.bucket;
    if (showBucketSelect.value) {
        getBuckets();
    }
});

const rules = readonly<OSSRules>({
    accessKeyId: [{ required: true, message: '请输入AccessKey ID' }],
    accessKeySecret: [{ required: true, message: '请输入AccessKey Secret' }],
    region: [{ required: true, message: '请输入Region' }],
    bucket: [{ required: true, message: '请选择Bucket' }],
    directory: [{ required: true, message: '请输入目录地址' }],
    domain: [{ required: true, message: '请输入访问域名' }],
});

// 获取bucket列表
const getBuckets = async () => {
    try {
        await ossForm.value.validateField(['accessKeyId', 'accessKeySecret', 'region']);
    } catch (error) {
        return;
    }
    loading.value = true;
    try {
        const bucketsList = await request('oss-list-buckets', {
            accessKeyId: form.value.accessKeyId,
            accessKeySecret: form.value.accessKeySecret,
            region: form.value.region,
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
    try {
        await ossForm.value.validate();
    } catch (error) {
        return;
    }

    saving.value = true;
    try {
        await request('oss-add-account', {
            accessKeyId: form.value.accessKeyId,
            accessKeySecret: form.value.accessKeySecret,
            region: form.value.region,
            bucket: form.value.bucket,
        });
        const ossStore = useOSSStore();
        ossStore.setConfigured(true);
        ElMessage.success('保存成功');
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
