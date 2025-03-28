import OpenAI from 'openai';
import { ModelService } from './model.service';
import { postRenderer } from '../window/window.service';

export class OpenAIService {
    private modelService = new ModelService();

    async validateModel(data: { apiKey: string; url: string; model: string }) {
        if (!data.url) {
            throw new Error('URL is required');
        }
        try {
            const openai = new OpenAI({
                apiKey: data.apiKey,
                baseURL: data.url,
            });

            const response = await openai.chat.completions.create({
                model: data.model,
                messages: [
                    {
                        role: 'user',
                        content: '收到消息后回复个句号。',
                    },
                ],
            });
            console.log('Model validation response:');
            console.log(response);
            return response.choices && response.choices.length > 0;
        } catch (error) {
            console.error('Model validation failed:', error.message);
            throw error;
        }
    }

    async chat(modelId: number, systemPrompt: string, userPrompt: string) {
        return new Promise<string>(async (resolve) => {
            try {
                const model = await this.modelService.getDetail(modelId);
                if (!model) {
                    throw new Error('Model not found');
                }

                const openai = new OpenAI({
                    apiKey: model.apiKey,
                    baseURL: model.url,
                });

                const stream = await openai.chat.completions.create({
                    model: model.model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userPrompt },
                    ],
                    stream: true,
                });
                let contents = '';
                for await (const chunk of stream) {
                    const content = chunk.choices[0]?.delta?.content || '';
                    contents += content;
                    if (content) {
                        postRenderer('theme-chat-chunk', content);
                    }
                }

                postRenderer('theme-chat-done');
                resolve(contents);
            } catch (error) {
                postRenderer('theme-chat-error', error.message);
                console.log(error.message);
            }
        });
    }
}
