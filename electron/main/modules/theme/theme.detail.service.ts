import { StoredDataType } from '../../shared/sql';
import sql from '../../shared/sql';
import dayjs from 'dayjs';

type Theme = StoredDataType['themes'][number];

export interface ThemeDetail extends Theme {
    systemPrompt?: string;
    userPrompt?: string;
    imageUrl?: string;
    modelId?: number;
}

export class ThemeDetailService {
    async getDetail(id: number): Promise<ThemeDetail | null> {
        const themes = await sql((db) => db.themes || []);
        const theme = themes.find((t) => t.id === id);
        if (!theme) return null;
        return {
            ...theme,
            systemPrompt: '',
            userPrompt: '',
            imageUrl: '',
            modelId: undefined,
        };
    }

    async update(data: Partial<ThemeDetail> & Pick<Theme, 'id'>): Promise<void> {
        const themes = await sql((db) => db.themes || []);
        const index = themes.findIndex((t) => t.id === data.id);
        if (index === -1) return;

        const updatedTheme = {
            ...themes[index],
            ...data,
        };

        themes[index] = updatedTheme;
        await sql((db) => {
            db.themes = themes;
        });
    }
}
