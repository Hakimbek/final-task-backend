import { Controller, Get, Param, Delete, UseGuards, Post, Body, Res, HttpStatus, Headers } from "@nestjs/common";
import { ResponseService } from "./response.service";
import { JwtAuthGuard } from "../jwt/jwt-auth.guard";
import { ResponseDto } from "./response.dto";
import { Response } from "express";
import { ResponseGuard } from "./response.guard";
import { JwtService } from "@nestjs/jwt";

@Controller('response')
export class ResponseController {
    constructor(
        private readonly responseService: ResponseService,
        private readonly jwtService: JwtService,
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

    @Get('user/:userId')
    @UseGuards(JwtAuthGuard, ResponseGuard)
    async getResponsesByUserId(@Param('userId') userId: string, @Res() res: Response) {
        try {
            const response = await this.responseService.getResponsesByUserId(userId);
            res.status(HttpStatus.OK).send(response);
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).send(error);
        }
    }

    @Get('template/:templateId')
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
    async createOrUpdateResponse(
        @Body() { userId, templateId, answers }: ResponseDto,
        @Res() res: Response,
        @Headers('authorization') authHeader: string
    ) {
        try {
            const token = authHeader?.split(' ')[1];
            const message = await this.responseService.createOrUpdateResponse(
                userId,
                templateId,
                answers,
                this.jwtService.decode(token)
                );
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