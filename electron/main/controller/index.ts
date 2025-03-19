import Service from '../service';

class Controller {
    async handlePrompt(formData) {
        try {
            const jsonData = JSON.parse(formData);
            const service = new Service();
            const result = await service.callAIModel(jsonData);
            return result;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default Controller;
