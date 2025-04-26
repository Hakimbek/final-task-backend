import { Injectable } from "@nestjs/common";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuid } from "uuid";

@Injectable()
export class S3Service {
    private s3 = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY || '',
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
        }
    });

    async getSignedUrl(
        fileName: string,
        fileType: string
    ): Promise<{ signedUrl: string, key: string }> {
        const key = `${uuid()}-${fileName}`;

        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            ContentType: fileType,
        });

        const signedUrl = await getSignedUrl(this.s3, command, { expiresIn: 60 });

        return { signedUrl, key };
    }
}
