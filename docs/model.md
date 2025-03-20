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

/**
 * 获取模型列表
 * @returns {Promise<Model[]>} 返回模型列表
 */
function getModelList(): Promise<Model[]>;

/**
 * 创建新模型
 * @param {object} data - 模型数据
 * @param {string} data.name - 模型名称
 * @param {string} data.url - API接口地址
 * @param {string} data.apiKey - API密钥
 * @returns {Promise<Model>} 返回创建的模型信息
 */
function createModel(data: { name: string; url: string; apiKey: string }): Promise<Model>;

/**
 * 更新模型配置
 * @param {number} id - 模型ID
 * @param {object} data - 更新的模型数据
 * @param {string} data.name - 模型名称
 * @param {string} data.url - API接口地址
 * @param {string} data.apiKey - API密钥
 * @returns {Promise<Model>} 返回更新后的模型信息
 */
function updateModel(
    id: number,
    data: {
        name: string;
        url: string;
        apiKey: string;
    }
): Promise<Model>;

/**
 * 删除模型
 * @param {number} id - 要删除的模型ID
 * @returns {Promise<void>}
 */
function deleteModel(id: number): Promise<void>;

/**
 * 获取模型详情
 * @param {number} id - 模型ID
 * @returns {Promise<Model>} 返回模型详情
 */
function getModelDetail(id: number): Promise<Model>;
```
