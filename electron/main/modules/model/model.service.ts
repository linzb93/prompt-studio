import sql, { StoredDataType } from '../../shared/sql';
import dayjs from 'dayjs';
import { OpenAIService } from '../model/openai.service';

type Model = StoredDataType['models'][number];

export class ModelService {
    private openAIService = new OpenAIService();
    async create(data: Omit<Model, 'id'>) {
        const models = await sql((db) => db.models || []);
        const id = models.length > 0 ? Math.max(...models.map((m) => m.id)) + 1 : 1;
        const newModel = {
            id,
            ...data,
            createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        };
        try {
            await this.openAIService.validateModel(newModel);
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
            await this.openAIService.validateModel(data);
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
}
