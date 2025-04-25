import { Controller, Get, Query, UseGuards, BadRequestException } from "@nestjs/common";
import { S3Service } from "./s3.service";
import { JwtAuthGuard } from "../jwt/jwt-auth.guard";

@Controller("signed-url")
export class UploadController {
    constructor(private readonly s3Service: S3Service) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    async getSignedUrl(
        @Query("fileName") fileName: string,
        @Query("fileType") fileType: string
    ) {
        try {
            return await this.s3Service.getSignedUrl(fileName, fileType);
        } catch (error) {
            throw new BadRequestException(error.response);
        }
    }
}
