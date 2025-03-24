import { ThemeDetailService } from './theme.detail.service';

export class ThemeDetailController {
    private themeDetailService = new ThemeDetailService();

    async getDetail(data: string) {
        const { id } = JSON.parse(data);
        return this.themeDetailService.getDetail(id);
    }

    async update(data: string) {
        const themeData = JSON.parse(data);
        await this.themeDetailService.update(themeData);
    }
}
