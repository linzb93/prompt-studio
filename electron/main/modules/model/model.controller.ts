import { ModelService } from './model.service';

export class ModelController {
    private modelService = new ModelService();

    async create(data: string) {
        return this.modelService.create(JSON.parse(data));
    }

    async update(data: string) {
        return this.modelService.update(JSON.parse(data));
    }

    async delete(data: string) {
        const { id } = JSON.parse(data);
        return this.modelService.delete(id);
    }

    async getList(data: string) {
        return this.modelService.getList(JSON.parse(data));
    }

    async getDetail(data: string) {
        const { id } = JSON.parse(data);
        return this.modelService.getDetail(id);
    }
}
