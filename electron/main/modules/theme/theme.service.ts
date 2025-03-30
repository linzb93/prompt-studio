import sql, { StoredDataType } from '../../shared/sql';
import {
    StoredDataType as HistoryStoredDataType,
    createHistoryFile,
    deleteHistoryFile,
} from '../../shared/sql/history';
import dayjs from 'dayjs';
import { HistoryService } from '../history/history.service';
import { ModelService } from '../model/model.service';
type Theme = StoredDataType['themes'][number];
type HistoryItem = HistoryStoredDataType['list'][number];

export class ThemeService {
    private historyService = new HistoryService();
    private modelService = new ModelService();

    async create(
        data: Pick<Theme, 'name'> & Pick<HistoryItem, 'modelId' | 'systemPrompt' | 'userPrompt'>
    ): Promise<void> {
        const themes = await sql((db) => db.themes || []);
        const id = themes.length > 0 ? Math.max(...themes.map((t) => t.id)) + 1 : 1;
        const createTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
        const theme: Theme = { id, name: data.name, createTime, contentId: 1 };
        await sql((db) => {
            db.themes = [theme, ...(db.themes || [])];
        });
        const aiResponse = await this.modelService.chat(data.modelId, data.systemPrompt, data.userPrompt);
        await createHistoryFile(id);
        this.historyService.create({
            themeId: id,
            modelId: data.modelId,
            title: data.name,
            systemPrompt: data.systemPrompt,
            userPrompt: data.userPrompt,
            aiResponse: aiResponse,
            isBest: false,
        });
    }

    async update(
        data: Pick<Theme, 'id' | 'name'> & Partial<Pick<HistoryItem, 'modelId' | 'systemPrompt' | 'userPrompt'>>
    ): Promise<void> {
        const themeExists = await sql((db) => (db.themes || []).some((t) => t.id === data.id));
        if (!themeExists) {
            throw new Error(`Theme with id ${data.id} does not exist`);
        }
        const aiResponse = await this.modelService.chat(data.modelId, data.systemPrompt, data.userPrompt);
        await createHistoryFile(data.id);
        const { id } = await this.historyService.create({
            themeId: data.id,
            modelId: data.modelId,
            title: data.name,
            systemPrompt: data.systemPrompt,
            userPrompt: data.userPrompt,
            aiResponse: aiResponse,
            isBest: false,
        });
        await sql((db) => {
            const themes = db.themes || [];
            const index = themes.findIndex((t) => t.id === data.id);
            if (index !== -1) {
                themes[index] = { ...themes[index], name: data.name, contentId: id };
                db.themes = themes;
            }
        });
    }

    async delete(data: Pick<Theme, 'id'>): Promise<void> {
        await sql((db) => {
            const themes = db.themes || [];
            db.themes = themes.filter((t) => t.id !== data.id);
        });
        await deleteHistoryFile(data.id);
    }

    async rename(data: Pick<Theme, 'id' | 'name'>): Promise<void> {
        const themeExists = await sql((db) => (db.themes || []).some((t) => t.id === data.id));
        if (!themeExists) {
            throw new Error(`Theme with id ${data.id} does not exist`);
        }
        await sql((db) => {
            const themes = db.themes || [];
            const index = themes.findIndex((t) => t.id === data.id);
            if (index !== -1) {
                themes[index] = { ...themes[index], name: data.name };
                db.themes = themes;
            }
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
                    modelName?: string;
                })
              | null
          )
        | null
    > {
        const theme = await sql((db) => (db.themes || []).find((t) => t.id === data.id));
        if (!theme) return null;
        const history = await sql.history(theme.id, (db) => (db.list || []).find((h) => h.id === theme.contentId));
        if (!history) return theme;
        const { modelId, systemPrompt, userPrompt, aiResponse } = history;
        const models = await sql((db) => db.models || []);
        const model = models.find((m) => m.id === modelId);
        if (!model) return { ...theme, modelId, systemPrompt, userPrompt, aiResponse, modelName: '' };
        return { ...theme, modelId, systemPrompt, userPrompt, aiResponse, modelName: model.name };
    }
}
