import fs from 'fs-extra';
import path from 'path';
import { root } from '../../enums/index.enum';

export interface StoredDataType {
    list: {
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
}

/**
 * 异步执行SQL操作，包括读取和写入JSON文件，并执行传入的回调函数
 *
 * 因History数据量较大，故单独放一个文件
 */
export default async function sql<R>(id: number, callback: (data: StoredDataType) => R) {
    try {
        const filePath = path.join(root, 'history', `${id}.json`);
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

export const createHistoryFile = async (id: number) => {
    const filePath = path.join(root, 'history', `${id}.json`);
    await fs.writeJSON(
        filePath,
        {
            list: [],
        },
        { spaces: 2 }
    );
};
export const deleteHistoryFile = async (id: number) => {
    const filePath = path.join(root, 'history', `${id}.json`);
    await fs.remove(filePath);
};
