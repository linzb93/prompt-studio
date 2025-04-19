import { SettingService } from './oss.service';

export class OSSController {
    private settingService = new SettingService();

    async addOSSAccount(accountJson: string): Promise<void> {
        const account = JSON.parse(accountJson);
        await this.settingService.createOSSAccount(account);
    }

    async listBuckets(accountJson: string): Promise<string[]> {
        const account = JSON.parse(accountJson);
        return await this.settingService.listBuckets();
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
