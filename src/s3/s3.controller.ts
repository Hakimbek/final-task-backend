import { Controller, Get, Query, UseGuards, Res, HttpStatus } from '@nestjs/common';
import { S3Service } from './s3.service';
import { JwtAuthGuard } from "../jwt/jwt-auth.guard";
import { Response } from "express";

@Controller('upload')
export class UploadController {
    constructor(private readonly s3Service: S3Service) {}

    @Get('signed-url')
    @UseGuards(JwtAuthGuard)
    async getSignedUrl(@Query('fileName') fileName: string, @Query('fileType') fileType: string, @Res() res: Response) {
        try {
            const result = await this.s3Service.getSignedUrl(fileName, fileType);
            res.status(HttpStatus.OK).send(result);
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).send(error);
        }
    }
}
