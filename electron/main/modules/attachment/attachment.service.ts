import sql from '../../shared/sql';
import { StoredDataType } from '../../shared/sql';

type AttachmentList = StoredDataType['attachments'];
type Attachment = AttachmentList[number];
/**
 * 附件服务类
 */
export class AttachmentService {
    /**
     * 添加附件
     * @param {Attachment} attachment 附件信息，包含名称和地址
     * @returns {Promise<void>} 无返回值
     */
    async addAttachment(attachment: Attachment): Promise<void> {
        await sql((db) => {
            if (!db.attachments) {
                db.attachments = [];
            }
            db.attachments.push(attachment);
        });
    }

    /**
     * 获取所有附件列表
     * @returns {Promise<Attachment[]>} 附件列表
     */
    async getAttachments(): Promise<Attachment[]> {
        return await sql((db) => db.attachments || []);
    }

    /**
     * 删除指定附件
     * @param {string} url 附件地址
     * @returns {Promise<void>} 无返回值
     */
    async deleteAttachment(url: string): Promise<void> {
        await sql((db) => {
            if (db.attachments) {
                db.attachments = db.attachments.filter((item) => item.url !== url);
            }
        });
    }
}
