import OpenAI from 'openai';
import { FormData } from '../types';

class Service {
    private openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({
            apiKey: '',
            baseURL: '',
        });
    }

    async callAIModel(formData: FormData) {
        try {
            const result = await this._callExternalAIModel(formData);
            return result;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async _callExternalAIModel(formData: FormData) {
        this.openai = new OpenAI({
            apiKey: formData.apiKey,
            baseURL: formData.modelUrl,
        });

        const completion = await this.openai.chat.completions.create({
            messages: [{ role: 'user', content: formData.prompt }],
            model: formData.modelName,
        });

        return {
            success: true,
            data: completion.choices[0].message.content,
        };
    }
}

export default Service;
