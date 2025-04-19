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
    async addAttachment(attachment: Omit<Attachment, 'id'>): Promise<void> {
        await sql((db) => {
            if (!db.attachments) {
                db.attachments = [];
            }
            const maxId = db.attachments.length > 0 ? Math.max(...db.attachments.map((a) => a.id)) : 0;
            const newAttachment = { ...attachment, id: maxId + 1 };
            db.attachments.push(newAttachment);
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
     * @param {number} id 附件ID
     * @returns {Promise<void>} 无返回值
     */
    async deleteAttachment(id: number): Promise<void> {
        await sql((db) => {
            if (db.attachments) {
                db.attachments = db.attachments.filter((item) => item.id !== id);
            }
        });
    }
}
