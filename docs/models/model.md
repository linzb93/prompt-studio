# 模型管理接口

```typescript
interface Model {
    /**
     * 模型的唯一标识符
     * @type {number}
     */
    id: number;

    /**
     * 模型的名称，用于显示和识别不同的模型
     * @type {string}
     */
    name: string;

    /**
     * 模型的API接口地址
     * @type {string}
     * @example "https://api.openai.com/v1/chat/completions"
     */
    url: string;

    /**
     * 访问模型API所需的密钥
     * @type {string}
     * @example "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
     */
    apiKey: string;
}
```

# 模型管理接口

接口名称：model-create
入参：Omit<Model, 'id'>
出参：无

接口名称：model-update
入参：Model
出参：无

接口名称：model-delete
入参：Pick<Model, 'id'>
出参：无

接口名称：model-get-list
入参：

-   pageIndex: number
-   pageSize: number
-   keyword?: string
    出参：Model[]

接口名称：model-get-detail
入参：Pick<Model, 'id'>
出参：Model

```

```
