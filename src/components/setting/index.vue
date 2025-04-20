<template>
    <el-drawer v-model="visible" title="设置" direction="rtl" :modal-class="'no-close-on-click-modal'" size="50%">
        <div class="settings-container">
            <div class="settings-menu">
                <el-menu :default-active="activeMenu" @select="handleMenuSelect">
                    <el-menu-item index="general">通用设置</el-menu-item>
                    <el-menu-item index="oss">OSS</el-menu-item>
                </el-menu>
            </div>
            <div class="settings-content">
                <component :is="currentComponent" />
            </div>
        </div>
    </el-drawer>
</template>

<script setup lang="ts">
import { ref, shallowRef } from 'vue';
import GeneralSettings from './GeneralSettings.vue';
import OSSSettings from './OSSSettings.vue';

const props = defineProps({
    visible: {
        type: Boolean,
        default: false,
    },
    menu: {
        type: String,
        default: 'general',
    },
});

const emit = defineEmits(['close', 'update:visible']);

const activeMenu = ref(props.menu || 'general');
const currentComponent = shallowRef(props.menu === 'oss' ? OSSSettings : GeneralSettings);

const handleMenuSelect = (index: string) => {
    activeMenu.value = index;
    if (index === 'general') {
        currentComponent.value = GeneralSettings;
    } else if (index === 'oss') {
        currentComponent.value = OSSSettings;
    }
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
