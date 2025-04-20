import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { QuestionService } from "./question.service";
import { JwtAuthGuard } from "../jwt/jwt-auth.guard";
import { QuestionDto, EditQuestionDto } from "./question.dto";

@Controller('question')
export class QuestionController {
    constructor(
        private readonly questionService: QuestionService
    ) {}

    @Get('template/:id')
    async getQuestionsByTemplateId(@Param('id') id: string) {
        return await this.questionService.getQuestionsByTemplateId(id);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async getQuestionById(@Param('id') id: string) {
        return await this.questionService.getQuestionById(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Body() { title, description, type, isVisible, templateId }: QuestionDto) {
        return await this.questionService.create(title, description, isVisible, type, templateId)
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async delete(@Param('id') id: string) {
        return await this.questionService.deleteById(id);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    async edit(@Param('id') id: string, @Body() { title, description, type, isVisible }: EditQuestionDto) {
        return await this.questionService.editQuestionById(id, title, description, isVisible, type);
    }
}