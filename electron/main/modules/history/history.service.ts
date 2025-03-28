import sql, { StoredDataType } from '../../shared/sql';
import dayjs from 'dayjs';

type History = StoredDataType['historyList'][number];

/** 历史记录服务类，用于管理主题的历史记录 */
export class HistoryService {
    /**
     * 创建新的历史记录
     * @param data 历史记录数据，不包含id和创建时间
     */
    async create(data: Omit<History, 'id' | 'createTime'>) {
        const histories = await sql((db) => db.historyList || []);
        const id = histories.length > 0 ? Math.max(...histories.map((h) => h.id)) + 1 : 1;
        const newHistory = {
            id,
            ...data,
            createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        };
        await sql((db) => {
            db.historyList = [...(db.historyList || []), newHistory];
        });
    }

    /**
     * 更新历史记录
     * @param data 完整的历史记录数据
     */
    async update(data: History) {
        await sql((db) => {
            db.historyList = (db.historyList || []).map((history) => (history.id === data.id ? data : history));
        });
    }

    /**
     * 删除历史记录
     * @param id 历史记录ID
     */
    async delete(id: number) {
        await sql((db) => {
            db.historyList = (db.historyList || []).filter((history) => history.id !== id);
        });
    }

    /**
     * 获取历史记录列表
     * @param params 查询参数
     * @param params.themeId 主题ID
     * @param params.modelId 可选的模型ID
     * @param params.keyword 可选的关键词
     * @returns 符合条件的历史记录列表
     */
    async getList(params: { themeId: number; modelId?: number; keyword?: string }) {
        return await sql((db) => {
            let histories = db.historyList || [];
            histories = histories.filter((history) => history.themeId === params.themeId);
            if (params.keyword) {
                histories = histories.filter((history) =>
                    history.title.toLowerCase().includes(params.keyword!.toLowerCase())
                );
            }

            return histories;
        });
    }

    /**
     * 获取历史记录详情
     * @param id 历史记录ID
     * @returns 历史记录详情，如果找到对应的模型则包含模型名称
     */
    async getDetail(id: number) {
        return await sql((db) => {
            const { models, historyList } = db;
            const history = historyList.find((h) => h.id === id);
            if (!history) return {};
            const model = models.find((m) => m.id === history.modelId);
            if (!model) {
                return history;
            }
            return {
                ...history,
                modelName: model.name,
            };
        });
    }

    /**
     * 标记最佳历史记录
     * @param id 历史记录ID
     * @param isBest 是否为最佳记录
     */
    async markBest(id: number, isBest: boolean) {
        await sql((db) => {
            db.historyList = (db.historyList || []).map((h) => ({
                ...h,
                isBest: h.id === id ? isBest : false,
            }));
        });
    }

    /**
     * 应用历史记录到主题
     * @param id 历史记录ID
     */
    async applyHistory(id: number) {
        await sql((db) => {
            const history = (db.historyList || []).find((h) => h.id === id);
            if (!history) return;

            const themes = db.themes || [];
            const themeIndex = themes.findIndex((t) => t.id === history.themeId);
            if (themeIndex !== -1) {
                themes[themeIndex] = { ...themes[themeIndex], contentId: id };
                db.themes = themes;
            }
        });
    }

    /**
     * 重命名历史记录
     * @param data 包含ID和新标题的对象
     * @throws 如果指定ID的历史记录不存在
     */
    async rename(data: Pick<History, 'id' | 'title'>): Promise<void> {
        const historyExists = await sql((db) => (db.historyList || []).some((h) => h.id === data.id));
        if (!historyExists) {
            throw new Error(`History with id ${data.id} does not exist`);
        }
        await sql((db) => {
            const history = db.historyList || [];
            const index = history.findIndex((h) => h.id === data.id);
            if (index !== -1) {
                history[index] = { ...history[index], title: data.title };
                db.historyList = history;
            }
        });
    }
}
