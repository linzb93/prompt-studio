import sql, { StoredDataType } from '../../shared/sql';
import dayjs from 'dayjs';
import { OpenAIService } from '../model/openai.service';

type Model = StoredDataType['models'][number];

/** 模型服务类，用于管理AI模型 */
export class ModelService {
    /** OpenAI服务实例 */
    private openAIService = new OpenAIService();

    /**
     * 创建新的模型
     * @param data 模型数据，不包含id
     * @returns 如果验证失败，返回错误信息
     */
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

    /**
     * 更新模型信息
     * @param data 完整的模型数据
     * @returns 如果验证失败，返回错误信息
     */
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

    /**
     * 删除模型
     * @param id 模型ID
     */
    async delete(id: number) {
        await sql((db) => {
            db.models = (db.models || []).filter((model) => model.id !== id);
        });
    }

    /**
     * 获取模型列表
     * @param params 查询参数
     * @param params.pageIndex 页码
     * @param params.pageSize 每页数量
     * @param params.keyword 可选的关键词，用于搜索模型名称或URL
     * @returns 符合条件的模型列表
     */
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

    /**
     * 获取模型详情
     * @param id 模型ID
     * @returns 模型详情信息
     */
    async getDetail(id: number) {
        const models = await sql((db) => db.models || []);
        return models.find((model) => model.id === id);
    }
}
