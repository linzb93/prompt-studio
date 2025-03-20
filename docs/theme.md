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
}

/**
 * 获取主题列表
 * @returns {Promise<Theme[]>} 返回主题列表
 */
function getThemeList(): Promise<Theme[]>;

/**
 * 创建新主题
 * @param {string} name - 主题名称
 * @returns {Promise<Theme>} 返回创建的主题信息
 */
function createTheme(name: string): Promise<Theme>;

/**
 * 更新主题信息
 * @param {number} id - 主题ID
 * @param {string} name - 新的主题名称
 * @returns {Promise<Theme>} 返回更新后的主题信息
 */
function updateTheme(id: number, name: string): Promise<Theme>;

/**
 * 删除主题
 * @param {number} id - 要删除的主题ID
 * @returns {Promise<void>}
 */
function deleteTheme(id: number): Promise<void>;

/**
 * 获取主题详情
 * @param {number} id - 主题ID
 * @returns {Promise<Theme>} 返回主题详情
 */
function getThemeDetail(id: number): Promise<Theme>;
```
