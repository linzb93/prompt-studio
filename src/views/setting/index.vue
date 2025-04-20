<template>
    <div class="settings-container">
        <div class="settings-menu">
            <el-menu :default-active="activeMenu" @select="handleMenuSelect">
                <el-menu-item index="general">通用设置</el-menu-item>
                <el-menu-item index="oss">OSS</el-menu-item>
            </el-menu>
        </div>
        <div class="settings-content">
            <el-button class="back-button" type="primary" plain @click="goBack">返回</el-button>
            <component :is="currentComponent" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, onMounted } from 'vue';
import GeneralSettings from './GeneralSettings.vue';
import OSSSettings from './OSSSettings.vue';
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();

const activeMenu = ref(route.query.menu || '');
const currentComponent = shallowRef();
onMounted(() => {
    handleMenuSelect(route.query.menu as string);
});

const handleMenuSelect = (index: string) => {
    activeMenu.value = index;
    if (index === 'general' || !index) {
        currentComponent.value = GeneralSettings;
    } else if (index === 'oss') {
        currentComponent.value = OSSSettings;
    }
};

const goBack = () => {
    router.go(-1);
};
</script>

<style scoped>
.settings-container {
    display: flex;
    height: 100%;
}

.settings-menu {
    width: 200px;
    border-right: 1px solid #e6e6e6;
}

.settings-content {
    flex: 1;
    padding: 20px;
    overflow: auto;
}
</style>
