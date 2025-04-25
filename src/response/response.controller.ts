import { Controller, Get, Param, Delete, UseGuards, Post, Body, Put, BadRequestException } from "@nestjs/common";
import { ResponseService } from "./response.service";
import { JwtAuthGuard } from "../jwt/jwt-auth.guard";
import { ResponseDto } from "./response.dto";
import { ResponseGuard } from "./response.guard";

@Controller("response")
export class ResponseController {
    constructor(
        private readonly responseService: ResponseService
    ) {}

    @Get("user/:userId")
    @UseGuards(JwtAuthGuard, ResponseGuard)
    async getResponsesByUserId(@Param("userId") userId: string) {
        try {
            return await this.responseService.getResponsesByUserId(userId);
        } catch (error) {
            throw new BadRequestException(error.response);
        }
    }

    @Get('template/:templateId')
    @UseGuards(JwtAuthGuard, ResponseGuard)
    async getResponsesByTemplateId(@Param('templateId') templateId: string) {
        try {
            return await this.responseService.getResponsesByTemplateId(templateId);
        } catch (error) {
            throw new BadRequestException(error.response);
        }
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async createResponse(@Body() { userId, templateId, answers }: ResponseDto) {
        try {
            return await this.responseService.createResponse(
                userId,
                templateId,
                answers
            );
        } catch (error) {
            throw new BadRequestException(error.response);
        }
    }

    @Put()
    @UseGuards(JwtAuthGuard, ResponseGuard)
    async editResponseById(
        @Param("responseId") responseId: string,
        @Body("answers") answers: { questionId: string; answer: string }[],
    ) {
        try {
            return await this.responseService.editResponseById(responseId, answers);
        } catch (error) {
            throw new BadRequestException(error.response);
        }
    }

    @Delete(":responseId")
    @UseGuards(JwtAuthGuard, ResponseGuard)
    async deleteResponseById(@Param("responseId") responseId: string) {
        try {
            return await this.responseService.deleteResponseById(responseId);
        } catch (error) {
            throw new BadRequestException(error.response);
        }
    }
}
