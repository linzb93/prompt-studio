import { app, BrowserWindow } from 'electron';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
// import init from '../../providers/init';
// import unhandled from 'electron-unhandled';
import { __dirname } from '../../enums/index.enum';
import { setWindow } from '../window/window.service';
import createMenu from '../menu/menu.service';
import createContextMenu from '../menu/contextMenu.service';

/** 应用程序接口选项 */
interface IAppOptions {
    /** 路由处理函数 */
    router: Function;
}

/**
 * 创建并初始化应用程序
 * @param options 应用程序配置选项
 */
export function createApp(options: IAppOptions) {
    app.whenReady().then(() => {
        // init();
        createWindow();
        setWindow(win);
        createMenu(win);
        createContextMenu(win);
        options.router();
    });
    setting();
}
let win: BrowserWindow | null = null;
/** 应用程序根目录路径 */
const APP_ROOT = join(__dirname, '../..');
/** 主进程构建输出目录路径 */
export const MAIN_DIST = join(APP_ROOT, 'dist-electron');
/** 渲染进程构建输出目录路径 */
export const RENDERER_DIST = join(APP_ROOT, 'dist');
/** Vite开发服务器URL */
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;
const preload = join(__dirname, '../preload/index.mjs');
const indexHtml = join(RENDERER_DIST, 'index.html');
/**
 * 配置应用程序基本设置
 * 包括单实例锁、应用程序ID和窗口关闭处理
 */
function setting() {
    // unhandled();
    const isMac = process.platform === 'darwin';
    // Set application name for Windows 10+ notifications
    if (!isMac) app.setAppUserModelId(app.getName());

    if (!app.requestSingleInstanceLock()) {
        app.quit();
        process.exit(0);
    }
    app.on('window-all-closed', () => {
        win = null;
        app.quit();
    });
}
/**
 * 创建主应用程序窗口
 * 配置窗口属性并加载应用程序内容
 */
async function createWindow() {
    win = new BrowserWindow({
        title: 'Prompt Studio',
        width: 1200,
        height: 800,
        webPreferences: {
            spellcheck: false,
            preload,
        },
    });

    if (VITE_DEV_SERVER_URL) {
        // #298
        win.loadURL(VITE_DEV_SERVER_URL);
        // Open devTool if the app is not packaged
        // win.webContents.openDevTools();
    } else {
        win.loadFile(indexHtml);
    }
}
