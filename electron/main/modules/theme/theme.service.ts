import sql, { StoredDataType } from '../../shared/sql';
import dayjs from 'dayjs';
import { HistoryService } from '../history/history.service';
import { ThemeOpenAI } from './theme.openai';
import { type IpcMainInvokeEvent } from 'electron';
type Theme = StoredDataType['themes'][number];
type HistoryItem = StoredDataType['historyList'][number];

export class ThemeService {
    private historyService = new HistoryService();
    private themeOpenAI = new ThemeOpenAI();

    async create(
        data: Pick<Theme, 'name'> & Pick<HistoryItem, 'modelId' | 'systemPrompt' | 'userPrompt'>
    ): Promise<void> {
        const themes = await sql((db) => db.themes || []);
        const id = themes.length > 0 ? Math.max(...themes.map((t) => t.id)) + 1 : 1;
        const createTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
        const theme: Theme = { id, name: data.name, createTime, contentId: 0 };
        await sql((db) => {
            db.themes = [...(db.themes || []), theme];
        });
        const aiResponse = await this.themeOpenAI.chat(data.modelId, data.systemPrompt, data.userPrompt);
        await this.historyService.create({
            themeId: id,
            modelId: data.modelId,
            title: data.name,
            systemPrompt: data.systemPrompt,
            userPrompt: data.userPrompt,
            aiResponse: aiResponse,
        });
    }

    async update(
        data: Pick<Theme, 'id' | 'name'> & Partial<Pick<HistoryItem, 'modelId' | 'systemPrompt' | 'userPrompt'>>
    ): Promise<void> {
        await sql((db) => {
            const themes = db.themes || [];
            const index = themes.findIndex((t) => t.id === data.id);
            if (index !== -1) {
                themes[index] = { ...themes[index], name: data.name };
                db.themes = themes;
            }
        });
        const aiResponse = await this.themeOpenAI.chat(data.modelId, data.systemPrompt, data.userPrompt);
        await this.historyService.create({
            themeId: data.id,
            modelId: data.modelId,
            title: data.name,
            systemPrompt: data.systemPrompt,
            userPrompt: data.userPrompt,
            aiResponse: aiResponse,
        });
    }

    async delete(data: Pick<Theme, 'id'>): Promise<void> {
        await sql((db) => {
            const themes = db.themes || [];
            const historyList = db.historyList || [];
            db.themes = themes.filter((t) => t.id !== data.id);
            db.historyList = historyList.filter((h) => h.themeId !== data.id);
        });
    }

    async getList(obj: { keyword: string }): Promise<Theme[]> {
        const { keyword } = obj;
        return await sql((db) => {
            const themes = db.themes || [];
            if (keyword) {
                return themes.filter((t) => t.name.toLowerCase().includes(keyword.toLowerCase()));
            }
            return themes;
        });
    }

    async getDetail(data: Pick<Theme, 'id'>): Promise<
        | (
              | (Theme & {
                    modelId?: number;
                    systemPrompt?: string;
                    userPrompt?: string;
                    aiResponse?: string;
                })
              | null
          )
        | null
    > {
        return await sql((db) => {
            const theme = (db.themes || []).find((t) => t.id === data.id);
            if (!theme) return null;
            const history = (db.historyList || []).find((h) => h.id === theme.contentId);
            if (!history) return theme;
            const { modelId, systemPrompt, userPrompt, aiResponse } = history;
            return { ...theme, modelId, systemPrompt, userPrompt, aiResponse };
        });
    }
}
