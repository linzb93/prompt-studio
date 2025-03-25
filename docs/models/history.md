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
```

# 历史记录管理接口

接口名称：history-delete
接口含义：删除指定的历史记录
入参：Pick<HistoryItem, 'id'>
出参：无

接口名称：history-get-list
接口含义：分页查询历史记录列表，支持按主题、模型、关键词和最佳标记筛选
入参：

-   pageIndex: number
-   pageSize: number
-   themeId?: number
-   modelId?: number
-   keyword?: string
-   isBest?: boolean
    出参：HistoryItem[]

接口名称：history-get-detail
接口含义：获取指定历史记录的详细信息
入参：Pick<HistoryItem, 'id'>
出参：HistoryItem

接口名称：history-mark-best
接口含义：将指定的历史记录标记或取消标记为最佳记录
入参：Pick<HistoryItem, 'id' | 'isBest'>
出参：HistoryItem
