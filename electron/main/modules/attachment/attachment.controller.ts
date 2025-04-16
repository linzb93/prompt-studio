import { AttachmentService } from './attachment.service';

export class AttachmentController {
    private attachmentService = new AttachmentService();

    async getAttachments(): Promise<any[]> {
        return await this.attachmentService.getAttachments();
    }

    async deleteAttachment(urlJson: string): Promise<void> {
        const { url } = JSON.parse(urlJson);
        await this.attachmentService.deleteAttachment(url);
    }
}
