import { HistoryService } from './history.service';

export class HistoryController {
    private historyService: HistoryService;

    constructor() {
        this.historyService = new HistoryService();
    }

    async getList(params: any) {
        return this.historyService.getList(params);
    }

    async getDetail(params: any) {
        return this.historyService.getDetail(params.id);
    }

    async create(params: any) {
        await this.historyService.create(params);
    }

    async update(params: any) {
        await this.historyService.update(params);
    }

    async delete(params: any) {
        await this.historyService.delete(params.id);
    }

    async markBest(params: any) {
        await this.historyService.markBest(params.id, params.isBest);
    }
}
