import { defineStore } from 'pinia';
import request from '../shared/request';

export const useOSSStore = defineStore('oss', {
    state: () => ({
        isConfigured: false,
    }),
    actions: {
        async checkConfig() {
            try {
                const res = await request('oss-check-config');
                this.isConfigured = res.enabled;
            } catch (error) {
                this.isConfigured = false;
            }
        },
        setConfigured(status: boolean) {
            this.isConfigured = status;
        },
    },
});
