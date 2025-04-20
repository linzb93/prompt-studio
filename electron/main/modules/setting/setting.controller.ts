import { SettingService } from './oss.service';
import { StoredDataType } from '../../shared/sql';

type OSSAccount = StoredDataType['ossAccount'];
export class OSSController {
    private settingService = new SettingService();

    /**
     * 检查OSS账户配置是否有效
     * @returns {Promise<{enabled: boolean}>} 返回布尔值，true表示已配置有效OSS账户，false表示未配置或配置无效
     */
    async checkConfig(): Promise<{ enabled: boolean }> {
        const account = await this.settingService.getOSSAccount();
        return {
            enabled: !!account?.accessKeyId,
        };
    }

    async addOSSAccount(data: string): Promise<void> {
        await this.settingService.createOSSAccount(JSON.parse(data));
    }

    async listBuckets(accountJson: string): Promise<string[]> {
        return await this.settingService.listBuckets(JSON.parse(accountJson));
    }

    async uploadFile(paramsJson: string): Promise<void> {
        const { filePath } = JSON.parse(paramsJson);
        await this.settingService.uploadFile(filePath);
    }

    async deleteFile(objectNameJson: string): Promise<void> {
        const { objectName } = JSON.parse(objectNameJson);
        await this.settingService.deleteFile(objectName);
    }

    async getOSSConfig(): Promise<OSSAccount | null> {
        return await this.settingService.getOSSAccount();
    }
}
