import { ipcMain } from 'electron';
import { ThemeController } from './modules/theme/theme.controller';
import response from './shared/response';
const themeController = new ThemeController();

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
};
