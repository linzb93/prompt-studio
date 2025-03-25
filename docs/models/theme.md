# 主题管理接口

```typescript
interface Theme {
    /**
     * 主题的唯一标识符
     * @type {number}
     */
    id: number;

    /**
     * 主题的显示名称
     * @type {string}
     */
    name: string;

    /**
     * 主题的创建时间，使用年月日时分秒格式的字符串表示
     * @type {string}
     * @example "2023-12-25 08:00:00"
     */
    createTime: string;
    /**
     * 记录Id
     * @type {number}
     */
    contentId: number;
}
```

# 主题管理接口

HistoryItem 数据类型见 "./history.md"
接口名称：theme-create
接口含义：创建一个新的主题
入参：Pick<Theme, 'name'> & Pick<HistoryItem, 'modelId' | 'systemPrompt' | 'userPrompt'>
出参：无

接口名称：theme-update
接口含义：更新指定主题的名称
入参：Pick<Theme, 'id' | 'name'> & Pick<HistoryItem, 'modelId' | 'systemPrompt' | 'userPrompt'>
出参：无

接口名称：theme-delete
接口含义：删除指定的主题
入参：Pick<Theme, 'id'>
出参：无

接口名称：theme-get-list
接口含义：分页查询主题列表，支持按关键词筛选
入参：

-   pageIndex: number
-   pageSize: number
-   keyword?: string
    出参：Theme[]

接口名称：theme-get-detail
接口含义：获取指定主题的详细信息
入参：Pick<Theme, 'id'>
出参：Theme

```

```
