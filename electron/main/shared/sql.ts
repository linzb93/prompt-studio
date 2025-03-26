import fs from 'fs-extra';
import path from 'path';
import { root } from '../enums/index.enum';

export interface StoredDataType {
    themes: {
        id: number;
        name: string;
        createTime: string;
        contentId: number;
    }[];
    historyList: {
        id: number;
        themeId: number;
        modelId: number;
        title: string;
        userPrompt: string;
        systemPrompt: string;
        aiResponse: string;
        createTime: string;
        isBest: boolean;
    }[];
    models: {
        id: number;
        name: string;
        model: string;
        createTime: string;
        url: string;
        apiKey: string;
    }[];
}

/**
 * 异步执行SQL操作，包括读取和写入JSON文件，并执行传入的回调函数
 */
export default async function sql<R>(callback: (data: StoredDataType) => R) {
    try {
        const filePath = path.join(root, 'data.json');
        if (!(await fs.pathExists(filePath))) {
            await fs.mkdirp(path.dirname(filePath));
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
