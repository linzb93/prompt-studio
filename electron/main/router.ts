import { ipcMain } from 'electron';
import { ThemeController } from './modules/theme/theme.controller';
import { ModelController } from './modules/model/model.controller';
import { HistoryController } from './modules/history/history.controller';
import { OSSController } from './modules/setting/setting.controller';
import response from './shared/response';
const themeController = new ThemeController();
const modelController = new ModelController();
const historyController = new HistoryController();
const ossController = new OSSController();

export default () => {
    // 主题管理相关接口
    ipcMain.handle('theme-create', (evt, data: string) => {
        return response(async () => await themeController.create(data));
    });

    ipcMain.handle('theme-update', (evt, data: string) => {
        return response(async () => await themeController.update(data));
    });

    ipcMain.handle('theme-delete', (evt, data: string) => {
        return response(async () => await themeController.delete(data));
    });

    ipcMain.handle('theme-get-list', (evt, data: string) => {
        return response(async () => await themeController.getList(data));
    });

    ipcMain.handle('theme-get-detail', (evt, data: string) => {
        return response(async () => await themeController.getDetail(data));
    });

    ipcMain.handle('theme-rename', (evt, data: string) => {
        return response(async () => await themeController.rename(data));
    });

    // 模型管理相关接口
    ipcMain.handle('model-create', (evt, data: string) => {
        return response(async () => await modelController.create(data));
    });

    ipcMain.handle('model-update', (evt, data: string) => {
        return response(async () => await modelController.update(data));
    });

    ipcMain.handle('model-delete', (evt, data: string) => {
        return response(async () => await modelController.delete(data));
    });

    ipcMain.handle('model-get-list', (evt, data: string) => {
        return response(async () => await modelController.getList(data));
    });

    ipcMain.handle('model-get-detail', (evt, data: string) => {
        return response(async () => await modelController.getDetail(data));
    });

    // 历史记录相关接口

    ipcMain.handle('history-delete', (evt, data: string) => {
        return response(async () => await historyController.delete(data));
    });

    ipcMain.handle('history-get-list', (evt, data: string) => {
        return response(async () => await historyController.getList(data));
    });

    ipcMain.handle('history-get-detail', (evt, data: string) => {
        return response(async () => await historyController.getDetail(data));
    });

    ipcMain.handle('history-mark-best', (evt, data: string) => {
        return response(async () => await historyController.markBest(data));
    });
    ipcMain.handle('history-apply', (evt, data: string) => {
        return response(async () => await historyController.applyHistory(data));
    });

    ipcMain.handle('history-rename', (evt, data: string) => {
        return response(async () => await historyController.rename(data));
    });

    // OSS相关接口
    ipcMain.handle('oss-add-account', (evt, data: string) => {
        return response(async () => await ossController.addOSSAccount(data));
    });

    ipcMain.handle('oss-validate-account', (evt, data: string) => {
        return response(async () => await ossController.validateAccount(data));
    });

    ipcMain.handle('oss-upload-file', (evt, data: string) => {
        return response(async () => await ossController.uploadFile(data));
    });

    ipcMain.handle('oss-delete-file', (evt, data: string) => {
        return response(async () => await ossController.deleteFile(data));
    });
};
