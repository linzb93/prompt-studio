import OSS from 'ali-oss';
import sql from '../../shared/sql';
import { StoredDataType } from '../../shared/sql';

type OSSAccount = StoredDataType['ossAccount'];

export class SettingService {
    /**
     * 创建OSS账户
     * @param {OSSAccount} data OSS账户配置信息
     * @returns {Promise<void>} 无返回值
     */
    async createOSSAccount(data: OSSAccount): Promise<void> {
        await sql((db) => {
            db.ossAccount = data;
        });
    }

    /**
     * 获取OSS账户配置信息
     * @returns {Promise<OSSAccount | null>} OSS账户配置信息，如果未配置则返回null
     */
    async getOSSAccount(): Promise<OSSAccount | null> {
        return await sql((db) => db.ossAccount || null);
    }

    /**
     * 获取OSS客户端实例
     * @returns {Promise<OSS>} OSS客户端实例
     * @throws {Error} 当OSS账户未配置时抛出错误
     */
    async getOSSClient(): Promise<OSS> {
        const account = await sql((db) => db.ossAccount || null);
        if (!account) throw new Error('OSS account not found');

        return new OSS({
            accessKeyId: account.accessKeyId,
            accessKeySecret: account.accessKeySecret,
            bucket: account.bucket,
            region: account.region,
        });
    }

    /**
     * 获取OSS存储桶列表
     * @returns {Promise<string[]>} 存储桶名称列表
     * @throws {Error} 当OSS账户未配置时抛出错误
     */
    async listBuckets(account?: OSSAccount): Promise<string[]> {
        const client = new OSS({
            accessKeyId: account.accessKeyId,
            accessKeySecret: account.accessKeySecret,
            region: account.region,
        });
        const result = await client.listBuckets();
        return result.buckets.map((bucket) => bucket.name);
    }

    /**
     * 上传文件到OSS
     * @param {string} filePath 本地文件路径
     * @param {string} objectName OSS对象名称
     * @throws {Error} 当OSS账户未配置或上传失败时抛出错误
     */
    async uploadFile(filePath: string, objectName: string): Promise<void> {
        const client = await this.getOSSClient();
        await client.put(objectName, filePath);
    }

    /**
     * 从OSS删除文件
     * @param {string} objectName 要删除的OSS对象名称
     * @throws {Error} 当OSS账户未配置或删除失败时抛出错误
     */
    async deleteFile(objectName: string): Promise<void> {
        const client = await this.getOSSClient();
        await client.delete(objectName);
    }
}
