# 历史记录接口

```typescript
interface HistoryItem {
    /**
     * 历史记录的唯一标识符
     * @type {number}
     */
    id: number;

    /**
     * 历史记录的标题
     * @type {string}
     */
    title: string;

    /**
     * 关联的主题ID
     * @type {number}
     */
    themeId: number;

    /**
     * 关联的模型ID
     * @type {number}
     */
    modelId: number;

    /**
     * 系统提示词内容
     * @type {string}
     */
    systemPrompt: string;

    /**
     * 用户输入的提示词内容
     * @type {string}
     */
    userPrompt: string;

    /**
     * AI模型的回复内容
     * @type {string}
     */
    aiResponse: string;

    /**
     * 是否被标记为最佳记录
     * @type {boolean}
     */
    isBest: boolean;

    /**
     * 历史记录的创建时间，使用年月日时分秒格式的字符串表示
     * @type {string}
     * @example "2023-12-25 08:00:00"
     */
    createTime: string;
}

/**
 * 获取历史记录列表
 * @param {number} themeId - 主题ID
 * @returns {Promise<HistoryItem[]>} 返回历史记录列表
 */
function getHistoryList(themeId: number): Promise<HistoryItem[]>;

/**
 * 创建新的历史记录
 * @param {object} data - 历史记录数据
 * @param {string} data.title - 记录标题
 * @param {number} data.themeId - 关联的主题ID
 * @param {number} data.modelId - 关联的模型ID
 * @param {string} data.systemPrompt - 系统提示词
 * @param {string} data.userPrompt - 用户提示词
 * @param {string} data.aiResponse - AI回复内容
 * @returns {Promise<HistoryItem>} 返回创建的历史记录
 */
function createHistory(data: {
    title: string;
    themeId: number;
    modelId: number;
    systemPrompt: string;
    userPrompt: string;
    aiResponse: string;
}): Promise<HistoryItem>;

/**
 * 删除历史记录
 * @param {number} id - 要删除的历史记录ID
 * @returns {Promise<void>}
 */
function deleteHistory(id: number): Promise<void>;

/**
 * 获取历史记录详情
 * @param {number} id - 历史记录ID
 * @returns {Promise<HistoryItem>} 返回历史记录详情
 */
function getHistoryDetail(id: number): Promise<HistoryItem>;

/**
 * 标记或取消标记历史记录为最佳记录
 * @param {number} id - 历史记录ID
 * @param {boolean} isBest - 是否标记为最佳
 * @returns {Promise<HistoryItem>} 返回更新后的历史记录
 */
function markHistoryAsBest(id: number, isBest: boolean): Promise<HistoryItem>;
```
