import sql, { StoredDataType } from '../../shared/sql';
import dayjs from 'dayjs';

type Theme = StoredDataType['themes'][number];

export class ThemeService {
    async create(data: Pick<Theme, 'name'>): Promise<void> {
        const themes = await sql((db) => db.themes || []);
        const id = themes.length > 0 ? Math.max(...themes.map((t) => t.id)) + 1 : 1;
        const createTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
        const theme: Theme = { id, name: data.name, createTime };
        await sql((db) => {
            db.themes = [...(db.themes || []), theme];
        });
    }

    async update(data: Pick<Theme, 'id' | 'name'>): Promise<void> {
        await sql((db) => {
            const themes = db.themes || [];
            const index = themes.findIndex((t) => t.id === data.id);
            if (index !== -1) {
                themes[index] = { ...themes[index], name: data.name };
                db.themes = themes;
            }
        });
    }

    async delete(data: Pick<Theme, 'id'>): Promise<void> {
        await sql((db) => {
            const themes = db.themes || [];
            db.themes = themes.filter((t) => t.id !== data.id);
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

    async getDetail(data: Pick<Theme, 'id'>): Promise<Theme | null> {
        const themes = await sql((db) => db.themes || []);
        return themes.find((t) => t.id === data.id) || null;
    }
}
