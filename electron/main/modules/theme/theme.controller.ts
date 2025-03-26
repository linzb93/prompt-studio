import { ThemeService } from './theme.service';

export class ThemeController {
    private themeService = new ThemeService();

    async create(data: string): Promise<void> {
        await this.themeService.create(JSON.parse(data));
    }

    async update(data: string): Promise<void> {
        await this.themeService.update(JSON.parse(data));
    }

    async delete(data: string): Promise<void> {
        await this.themeService.delete(JSON.parse(data));
    }

    async getList(data: string): Promise<any> {
        return this.themeService.getList(JSON.parse(data));
    }
    async rename(data: string): Promise<any> {
        return this.themeService.rename(JSON.parse(data));
    }

    async getDetail(data: string): Promise<any> {
        return this.themeService.getDetail(JSON.parse(data));
    }
}
