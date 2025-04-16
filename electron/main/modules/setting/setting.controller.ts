import { SettingService } from './oss.service';

export class OSSController {
    private settingService = new SettingService();

    async addOSSAccount(accountJson: string): Promise<void> {
        const account = JSON.parse(accountJson);
        await this.settingService.createOSSAccount(account);
    }

    async validateAccount(accountJson: string): Promise<boolean> {
        try {
            await this.settingService.listBuckets();
            return true;
        } catch (error) {
            return false;
        }
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
