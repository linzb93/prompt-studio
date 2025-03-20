import fs from 'fs-extra';
import path from 'path';
import { app } from 'electron';

interface Model {
    title: string;
    modelUrl: string;
    modelName: string;
    apiKey: string;
    prompt: string;
}

export interface StoredDataType {
    models: Model[];
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
