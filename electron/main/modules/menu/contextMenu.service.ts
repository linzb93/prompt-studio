import { type BrowserWindow, Menu } from 'electron';
import { postRenderer } from '../window/window.service';
/**
 * 创建应用程序右键菜单
 * @param win 浏览器窗口实例
 */
export default (win: BrowserWindow) => {
    win.webContents.addListener('context-menu', (_, params) => {
        const rightMenu = Menu.buildFromTemplate([
            {
                label: '刷新应用',
                click: () => {
                    win.webContents.reload();
                },
            },
            {
                label: '刷新页面',
                click() {
                    postRenderer('reload');
                },
            },
            {
                label: '开发者工具',
                click: () => {
                    win.webContents.openDevTools({
                        mode: 'detach',
                    });
                },
            },
        ]);
        rightMenu.popup({
            x: params.x + 5,
            y: params.y + 15,
        });
    });
};
