<template>
    <div class="general-settings">
        <h3>通用设置</h3>
        <el-form label-width="120px">
            <el-form-item label="超时时间">
                <el-input-number v-model="timeout" :min="5" />
                <span style="margin-left: 8px">秒</span>
            </el-form-item>
        </el-form>
        <el-button type="primary" style="margin-top: 20px">保存</el-button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const timeout = ref(5);
</script>

<style scoped>
.general-settings {
    padding: 20px;
}
</style>
