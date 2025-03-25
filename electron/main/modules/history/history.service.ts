import sql, { StoredDataType } from '../../shared/sql';
import dayjs from 'dayjs';

type History = StoredDataType['historyList'][number];

export class HistoryService {
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

    async update(data: History) {
        await sql((db) => {
            db.historyList = (db.historyList || []).map((history) => (history.id === data.id ? data : history));
        });
    }

    async delete(id: number) {
        await sql((db) => {
            db.historyList = (db.historyList || []).filter((history) => history.id !== id);
        });
    }

    async getList(params: {
        pageIndex: number;
        pageSize: number;
        themeId: number;
        modelId?: number;
        keyword?: string;
    }) {
        return await sql((db) => {
            let histories = (db.historyList || []).filter((history) => history.themeId === params.themeId);

            if (params.modelId) {
                histories = histories.filter((history) => history.modelId === params.modelId);
            }

            if (params.keyword) {
                histories = histories.filter(
                    (history) =>
                        history.title.toLowerCase().includes(params.keyword!.toLowerCase()) ||
                        history.systemPrompt.toLowerCase().includes(params.keyword!.toLowerCase()) ||
                        history.userPrompt.toLowerCase().includes(params.keyword!.toLowerCase()) ||
                        history.aiResponse.toLowerCase().includes(params.keyword!.toLowerCase())
                );
            }

            return histories;
        });
    }

    async getDetail(id: number) {
        const histories = await sql((db) => db.historyList || []);
        return histories.find((history) => history.id === id);
    }

    async markBest(id: number, isBest: boolean) {
        await sql((db) => {
            db.historyList = (db.historyList || []).map((history) =>
                history.id === id ? { ...history, isBest } : history
            );
        });
    }
}
