import { HistoryService } from './history.service';

export class HistoryController {
    private historyService: HistoryService;

    constructor() {
        this.historyService = new HistoryService();
    }

    async getList(params: string) {
        const parsedParams = JSON.parse(params);
        return this.historyService.getList(parsedParams);
    }

    async getDetail(params: string) {
        const parsedParams = JSON.parse(params);
        return this.historyService.getDetail(parsedParams.id);
    }

    async update(params: string) {
        const parsedParams = JSON.parse(params);
        await this.historyService.update(parsedParams);
    }

    async delete(params: string) {
        const parsedParams = JSON.parse(params);
        await this.historyService.delete(parsedParams.id);
    }

    async markBest(params: string) {
        const parsedParams = JSON.parse(params);
        await this.historyService.markBest(parsedParams.id, parsedParams.isBest);
    }
    async rename(params: string) {
        const parsedParams = JSON.parse(params);
        await this.historyService.rename({
            id: parsedParams.id,
            title: parsedParams.title,
        });
    }

    async applyHistory(params: string) {
        const parsedParams = JSON.parse(params);
        await this.historyService.applyHistory(parsedParams.id);
    }
}
