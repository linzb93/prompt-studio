import OpenAI from 'openai';
import { StoredDataType } from '../../shared/sql';
import { postRenderer } from '../window/window.service';

type Model = StoredDataType['models'][number];

/** OpenAI服务类，用于处理与OpenAI API的交互 */
export class OpenAIService {
    /**
     * 验证模型配置是否有效
     * @param data 模型配置数据
     * @param data.apiKey OpenAI API密钥
     * @param data.url API基础URL
     * @param data.model 模型名称
     * @returns 如果验证成功返回true
     * @throws 如果验证失败则抛出错误
     */
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
            return response.choices && response.choices.length > 0;
        } catch (error) {
            console.error('Model validation failed:', error.message);
            throw error;
        }
    }

    /**
     * 与AI模型进行对话
     * @param modelId 模型ID
     * @param systemPrompt 系统提示词
     * @param userPrompt 用户提示词
     * @returns 返回AI的回复内容
     */
    async chat(model: Model, systemPrompt: string, userPrompt: string) {
        return new Promise<string>(async (resolve) => {
            try {
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
            }
        });
    }
}
