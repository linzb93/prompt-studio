import fs from 'fs-extra';
import path from 'path';
import { app } from 'electron';

interface Model {
    id: number;
    modelUrl: string;
    modelName: string;
    apiKey: string;
}

export interface DebugRecord {
    id: number;
    moduleId: string;
    createTime: string;
    data: any;
}

/**
 * 调试模块的数据结构
 * @property id 模块的唯一标识符
 * @property name 模块的名称
 */
export interface DebugModule {
    id: number;
    name: string;
    createTime: string;
}

export interface StoredDataType {
    models: Model[];
    debugModules: DebugModule[];
}

/**
 * 异步执行SQL操作，包括读取和写入JSON文件，并执行传入的回调函数
 */
export default async function sql<R>(callback: (data: StoredDataType) => R) {
    try {
        const filePath = path.join(app.getPath('userData'), 'data.json');
        if (!(await fs.pathExists(filePath))) {
            await fs.writeJSON(filePath, {}, { spaces: 2 });
        }
        const storedData = await fs.readJSON(filePath);
        const result = await callback(storedData);
        await fs.writeJSON(filePath, storedData, { spaces: 2 });
        return result;
    } catch (error) {
        console.error('Error reading or parsing JSON file:', error);
        throw error;
    }
}
