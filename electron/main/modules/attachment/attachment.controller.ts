import { AttachmentService } from './attachment.service';

export class AttachmentController {
    private attachmentService = new AttachmentService();

    async getAttachments(): Promise<any[]> {
        return await this.attachmentService.getAttachments();
    }

    async deleteAttachment(idJson: string): Promise<void> {
        const { id } = JSON.parse(idJson);
        await this.attachmentService.deleteAttachment(id);
    }
}
