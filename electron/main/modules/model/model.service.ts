import sql, { StoredDataType } from '../../shared/sql';
import dayjs from 'dayjs';
import OpenAI from 'openai';

type Model = StoredDataType['models'][number];

export class ModelService {
    async create(data: Omit<Model, 'id'>) {
        const models = await sql((db) => db.models || []);
        const id = models.length > 0 ? Math.max(...models.map((m) => m.id)) + 1 : 1;
        const newModel = {
            id,
            ...data,
            createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        };
        try {
            await this.validateModel(newModel);
        } catch (error) {
            return {
                code: 400,
                message: (error as Error).message,
            };
        }
        await sql((db) => {
            db.models = [...(db.models || []), newModel];
        });
    }

    async update(data: Model) {
        try {
            await this.validateModel(data);
        } catch (error) {
            return {
                code: 400,
                message: (error as Error).message,
            };
        }
        await sql((db) => {
            db.models = (db.models || []).map((model) => (model.id === data.id ? data : model));
        });
    }

    async delete(id: number) {
        await sql((db) => {
            db.models = (db.models || []).filter((model) => model.id !== id);
        });
    }

    async getList(params: { pageIndex: number; pageSize: number; keyword?: string }) {
        const models = await sql((db) => db.models || []);
        let filteredModels = models;
        if (params.keyword) {
            filteredModels = models.filter(
                (model) =>
                    model.name.toLowerCase().includes(params.keyword!.toLowerCase()) ||
                    model.url.toLowerCase().includes(params.keyword!.toLowerCase())
            );
        }
        return filteredModels;
    }

    async getDetail(id: number) {
        const models = await sql((db) => db.models || []);
        return models.find((model) => model.id === id);
    }

    async validateModel(data: Omit<Model, 'id'>) {
        if (!data.url) {
            throw new Error('URL is required');
        }
        try {
            // 使用OpenAI SDK验证模型
            const openai = new OpenAI({
                apiKey: data.apiKey,
                baseURL: data.url,
            });

            // 发送测试请求
            const response = await openai.chat.completions.create({
                model: data.model,
                messages: [
                    {
                        role: 'user',
                        content: '收到消息后回复个句号。',
                    },
                ],
            });
            console.log('Model validation response:');
            console.log(response);
            return response.choices && response.choices.length > 0;
        } catch (error) {
            console.error('Model validation failed:', error.message);
            throw error;
        }
    }
}
