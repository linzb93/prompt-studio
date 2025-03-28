import sql from '../../shared/sql';
import { StoredDataType } from '../../shared/sql/history';
import dayjs from 'dayjs';

type History = StoredDataType['list'][number];

/** 历史记录服务类，用于管理主题的历史记录 */
export class HistoryService {
    /**
     * 创建新的历史记录
     * @param data - 历史记录数据对象
     * @param data.themeId - 主题ID，用于关联历史记录所属的主题
     * @param data.modelId - 模型ID，用于标识使用的AI模型
     * @param data.title - 历史记录标题
     * @param data.systemPrompt - 系统提示词
     * @param data.userPrompt - 用户提示词
     * @param data.aiResponse - AI响应内容
     * @param data.isBest - 是否为最佳记录
     * @returns {Promise<void>} 无返回值
     * @example
     * await historyService.create({
     *   themeId: 1,
     *   modelId: 1,
     *   title: "示例记录",
     *   systemPrompt: "系统提示",
     *   userPrompt: "用户提示",
     *   aiResponse: "AI响应",
     *   isBest: false
     * });
     */
    async create(data: Omit<History, 'id' | 'createTime'>) {
        const histories = await sql.history(data.themeId, (db) => db.list || []);
        const id = histories.length > 0 ? Math.max(...histories.map((h) => h.id)) + 1 : 1;
        const newHistory = {
            id,
            ...data,
            createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        };
        await sql.history(data.themeId, (db) => {
            db.list = [...(db.list || []), newHistory];
        });
    }

    /**
     * 更新历史记录
     * @param data - 完整的历史记录数据对象
     * @param data.id - 历史记录ID
     * @param data.themeId - 主题ID
     * @param data.title - 历史记录标题
     * @param data.systemPrompt - 系统提示词
     * @param data.userPrompt - 用户提示词
     * @param data.aiResponse - AI响应内容
     * @param data.isBest - 是否为最佳记录
     * @param data.createTime - 创建时间
     * @returns {Promise<void>} 无返回值
     * @throws {Error} 如果历史记录不存在
     */
    async update(data: History): Promise<void> {
        await sql.history(data.themeId, (db) => {
            db.list = (db.list || []).map((history) => (history.id === data.id ? data : history));
        });
    }

    /**
     * 删除历史记录
     * @param data - 删除参数对象
     * @param data.id - 要删除的历史记录ID
     * @param data.themeId - 主题ID
     * @returns {Promise<void>} 无返回值
     */
    async delete(data: { id: number; themeId: number }): Promise<void> {
        const { id, themeId } = data;
        await sql.history(themeId, (db) => {
            db.list = (db.list || []).filter((history) => history.id !== id);
        });
    }

    /**
     * 获取历史记录列表
     * @param params - 查询参数对象
     * @param params.themeId - 主题ID，用于筛选特定主题的历史记录
     * @param params.keyword - 可选的关键词，用于按标题搜索历史记录
     * @returns {Promise<History[]>} 返回符合条件的历史记录数组
     * @example
     * const histories = await historyService.getList({
     *   themeId: 1,
     *   keyword: "测试"
     * });
     */
    async getList(params: { themeId: number; keyword?: string }): Promise<History[]> {
        return await sql.history(params.themeId, (db) => {
            let histories = db.list || [];
            histories = histories.filter((history) => history.themeId === params.themeId);
            if (params.keyword) {
                histories = histories.filter((history) =>
                    history.title.toLowerCase().includes(params.keyword!.toLowerCase())
                );
            }

            return histories;
        });
    }

    /**
     * 获取历史记录详情
     * @param data - 查询参数对象
     * @param data.id - 历史记录ID
     * @param data.themeId - 主题ID
     * @returns {Promise<History & { modelName?: string } | {}>} 返回历史记录详情，如果找到对应的模型则包含模型名称
     * @example
     * const detail = await historyService.getDetail({
     *   id: 1,
     *   themeId: 1
     * });
     */
    async getDetail(data: { id: number; themeId: number }) {
        const { id, themeId } = data;
        const historyList = await sql.history(themeId, (db) => db.list || []);
        const models = await sql((db) => db.models || []);
        const history = historyList.find((h) => h.id === id);
        if (!history) return {};
        const model = models.find((m) => m.id === history.modelId);
        if (!model) {
            return history;
        }
        return {
            ...history,
            modelName: model.name,
        };
    }

    /**
     * 标记最佳历史记录
     * @param data - 标记参数对象
     * @param data.id - 历史记录ID
     * @param data.isBest - 是否标记为最佳记录
     * @param data.themeId - 主题ID
     * @returns {Promise<void>} 无返回值
     * @example
     * await historyService.markBest({
     *   id: 1,
     *   themeId: 1,
     *   isBest: true
     * });
     */
    async markBest(data: { id: number; isBest: boolean; themeId: number }): Promise<void> {
        const { id, isBest, themeId } = data;
        await sql.history(themeId, (db) => {
            db.list = (db.list || []).map((h) => ({
                ...h,
                isBest: h.id === id ? isBest : false,
            }));
        });
    }

    /**
     * 应用历史记录到主题
     * @param data - 应用参数对象
     * @param data.id - 要应用的历史记录ID
     * @param data.themeId - 主题ID
     * @returns {Promise<void>} 无返回值
     * @description 将指定的历史记录设置为主题的内容
     */
    async applyHistory(data: { id: number; themeId: number }): Promise<void> {
        const { id, themeId } = data;
        const themes = await sql((db) => db.themes || []);
        const history = (await sql.history(themeId, (db) => db.list || [])).find((h) => h.id === id);
        if (!history) return;
        const themeIndex = themes.findIndex((t) => t.id === history.themeId);
        if (themeIndex !== -1) {
            themes[themeIndex] = { ...themes[themeIndex], contentId: id };
            await sql((db) => (db.themes = themes));
        }
    }

    /**
     * 重命名历史记录
     * @param data - 重命名参数对象
     * @param data.id - 历史记录ID
     * @param data.title - 新的标题
     * @param data.themeId - 主题ID
     * @returns {Promise<void>} 无返回值
     * @throws {Error} 如果指定ID的历史记录不存在
     * @example
     * await historyService.rename({
     *   id: 1,
     *   themeId: 1,
     *   title: "新标题"
     * });
     */
    async rename(data: Pick<History, 'id' | 'title' | 'themeId'>): Promise<void> {
        const historyExists = await sql.history(data.themeId, (db) => (db.list || []).some((h) => h.id === data.id));
        if (!historyExists) {
            throw new Error(`History with id ${data.id} does not exist`);
        }
        await sql.history(data.themeId, (db) => {
            const history = db.list || [];
            const index = history.findIndex((h) => h.id === data.id);
            if (index !== -1) {
                history[index] = { ...history[index], title: data.title };
                db.list = history;
            }
        });
    }
}
