import OpenAI from 'openai';
import { FormData } from '../types';
import { saveModel } from './database';

class Service {
    private openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({
            apiKey: '',
            baseURL: '',
        });
    }

    async callAIModel(formData: FormData, event) {
        try {
            const result = await this._callExternalAIModel(formData, event);
            saveModel(formData);
            return result.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async _callExternalAIModel(formData: FormData, event) {
        this.openai = new OpenAI({
            apiKey: formData.apiKey,
            baseURL: formData.modelUrl,
        });

        const completion = await this.openai.chat.completions.create({
            messages: [{ role: 'user', content: formData.prompt }],
            model: formData.modelName,
            stream: true,
        });
        for await (const chunk of completion) {
            event.sender.send('ai-response-chunk', { status: 'success', data: chunk.choices[0]?.delta?.content || '' });
        }
        event.sender.send('ai-response-end', { status: 'success' });

        return {
            success: true,
            data: '',
        };
    }
}

export default Service;
