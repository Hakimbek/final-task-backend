import { Module } from "@nestjs/common";
import { S3Service } from "./s3.service";
import { UploadController } from "./s3.controller";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [JwtModule],
    controllers: [UploadController],
    providers: [S3Service],
})
export class S3Module {}
