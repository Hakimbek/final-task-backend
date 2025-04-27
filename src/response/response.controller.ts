import {Controller, Get, Param, Delete, UseGuards, Post, Body, Put, BadRequestException, Headers} from "@nestjs/common";
import { ResponseService } from "./response.service";
import { JwtAuthGuard } from "../jwt/jwt-auth.guard";
import { ResponseDto, EditResponseDto } from "./response.dto";
import { ResponseGuard } from "./response.guard";
import { JwtService } from "@nestjs/jwt";

@Controller("response")
export class ResponseController {
    constructor(
        private readonly responseService: ResponseService,
        private readonly jwtService: JwtService
    ) {}

    @Get("response/:responseId")
    @UseGuards(JwtAuthGuard, ResponseGuard)
    async getResponsesById(@Param("responseId") responseId: string) {
        try {
            return await this.responseService.getResponseById(responseId);
        } catch (error) {
            throw new BadRequestException(error.response);
        }
    }

    @Get("user/:userId")
    @UseGuards(JwtAuthGuard, ResponseGuard)
    async getResponsesByUserId(@Param("userId") userId: string) {
        try {
            return await this.responseService.getResponsesByUserId(userId);
        } catch (error) {
            throw new BadRequestException(error.response);
        }
    }

    @Get("user/:userId/template/:templateId")
    @UseGuards(JwtAuthGuard, ResponseGuard)
    async getResponseByUserAndTemplateId(
        @Param("userId") userId: string,
        @Param("templateId") templateId: string
    ) {
        try {
            return await this.responseService.getResponseByUserAndTemplateId(userId, templateId);
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
    async createResponse(
        @Body() { userId, templateId, answers }: ResponseDto,
        @Headers('authorization') authHeader: string
    ) {
        try {
            const authUserId = this.jwtService.decode(authHeader?.split(' ')[1])?.id;
            return await this.responseService.createResponse(
                userId,
                templateId,
                answers,
                authUserId
            );
        } catch (error) {
            throw new BadRequestException(error.response);
        }
    }

    @Put(":responseId")
    @UseGuards(JwtAuthGuard, ResponseGuard)
    async editResponseById(
        @Param("responseId") responseId: string,
        @Body() { answers }: EditResponseDto,
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
