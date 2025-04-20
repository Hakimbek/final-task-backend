import { Controller, Get, Param, Delete, UseGuards, Post, Body, Res, HttpStatus } from "@nestjs/common";
import { ResponseService } from "./response.service";
import { JwtAuthGuard } from "../jwt/jwt-auth.guard";
import { ResponseDto } from "./response.dto";
import { Response } from "express";

@Controller('response')
export class ResponseController {
    constructor(
        private readonly responseService: ResponseService,
    ) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    async getAllResponses(@Res() res: Response) {
        try {
            const responses = await this.responseService.getAllResponses();
            res.status(HttpStatus.OK).send(responses);
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).send(error);
        }
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async getById(@Param('id') id: string, @Res() res: Response) {
        try {
            const response = await this.responseService.getResponseById(id);
            res.status(HttpStatus.OK).send(response);
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).send(error);
        }
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Body() { userId, templateId, answers }: ResponseDto, @Res() res: Response) {
        try {
            const message = await this.responseService.create(userId, templateId, answers);
            res.status(HttpStatus.OK).send({ message });
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).send(error);
        }
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async delete(@Param('id') id: string, @Res() res: Response) {
        try {
            const message = await this.responseService.deleteById(id);
            res.status(HttpStatus.OK).send({ message });
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).send(error);
        }
    }
}