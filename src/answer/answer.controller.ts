import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { AnswerService } from "./answer.service";
import { JwtAuthGuard } from "../jwt/jwt-auth.guard";
import { AnswerDto } from "./answer.dto";

@Controller('answer')
export class AnswerController {
    constructor(
        private readonly answerService: AnswerService,
    ) {}

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async getAllResponses(@Param('id') id: string) {
        return await this.answerService.getAnswersByResponseId(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Body() { questionId, responseId, answer }: AnswerDto) {
        return await this.answerService.create(responseId, questionId, answer);
    }
}