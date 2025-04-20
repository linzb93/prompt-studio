import { SettingService } from './oss.service';

export class OSSController {
    private settingService = new SettingService();

    /**
     * 检查OSS账户配置是否有效
     * @returns {Promise<boolean>} 返回布尔值，true表示已配置有效OSS账户，false表示未配置或配置无效
     */
    async checkConfig(): Promise<boolean> {
        const account = await this.settingService.getOSSAccount();
        return !!account?.accessKeyId;
    }

    async addOSSAccount(data: string): Promise<void> {
        const { accessKeyId, accessKeySecret, bucket, region } = JSON.parse(data);
        await this.settingService.createOSSAccount({ accessKeyId, accessKeySecret, bucket, region });
    }

    async listBuckets(accountJson: string): Promise<string[]> {
        return await this.settingService.listBuckets(JSON.parse(accountJson));
    }

    async uploadFile(paramsJson: string): Promise<void> {
        const { filePath, objectName } = JSON.parse(paramsJson);
        await this.settingService.uploadFile(filePath, objectName);
    }

    async deleteFile(objectNameJson: string): Promise<void> {
        const { objectName } = JSON.parse(objectNameJson);
        await this.settingService.deleteFile(objectName);
    }
}
