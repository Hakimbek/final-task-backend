import { Controller, Get, Param, Delete, UseGuards, Post, Body, Res, HttpStatus } from "@nestjs/common";
import { ResponseService } from "./response.service";
import { JwtAuthGuard } from "../jwt/jwt-auth.guard";
import { ResponseDto } from "./response.dto";
import { Response } from "express";
import { ResponseGuard } from "./response.guard";

@Controller('response')
export class ResponseController {
    constructor(
        private readonly responseService: ResponseService,
    ) {}

    // @Get()
    // @UseGuards(JwtAuthGuard)
    // async getAllResponses(@Res() res: Response) {
    //     try {
    //         const responses = await this.responseService.getResponses();
    //         res.status(HttpStatus.OK).send(responses);
    //     } catch (error) {
    //         res.status(HttpStatus.BAD_REQUEST).send(error);
    //     }
    // }

    // @Get(':responseId')
    // @UseGuards(JwtAuthGuard)
    // async getById(@Param('responseId') responseId: string, @Res() res: Response) {
    //     try {
    //         const response = await this.responseService.getResponseById(responseId);
    //         res.status(HttpStatus.OK).send(response);
    //     } catch (error) {
    //         res.status(HttpStatus.BAD_REQUEST).send(error);
    //     }
    // }

    @Get(':templateId')
    @UseGuards(JwtAuthGuard, ResponseGuard)
    async getResponsesByTemplateId(@Param('templateId') templateId: string, @Res() res: Response) {
        try {
            const response = await this.responseService.getResponsesByTemplateId(templateId);
            res.status(HttpStatus.OK).send(response);
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).send(error);
        }
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async createResponse(@Body() { userId, templateId, answers }: ResponseDto, @Res() res: Response) {
        try {
            const message = await this.responseService.createOrUpdateResponse(userId, templateId, answers);
            res.status(HttpStatus.OK).send({ message });
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).send(error);
        }
    }

    @Delete(':responseId')
    @UseGuards(JwtAuthGuard, ResponseGuard)
    async deleteResponseById(@Param('responseId') responseId: string, @Res() res: Response) {
        try {
            const message = await this.responseService.deleteResponseById(responseId);
            res.status(HttpStatus.OK).send({ message });
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).send(error);
        }
    }
}