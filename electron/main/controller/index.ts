import Service from '../service';

class Controller {
    async handlePrompt(formData, event) {
        try {
            const jsonData = JSON.parse(formData);
            const service = new Service();
            await service.callAIModel(jsonData, event);

            return { status: 'success' };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default Controller;
