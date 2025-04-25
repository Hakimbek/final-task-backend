import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, Patch, BadRequestException } from "@nestjs/common";
import { QuestionService } from "./question.service";
import { JwtAuthGuard } from "../jwt/jwt-auth.guard";
import { QuestionDto, EditQuestionDto } from "./question.dto";
import { QuestionGuard } from "./question.guard";
import { ReorderDto } from "./question.dto";

@Controller("question")
export class QuestionController {
    constructor(
        private readonly questionService: QuestionService
    ) {}

    @Get(":questionId")
    @UseGuards(JwtAuthGuard, QuestionGuard)
    async getQuestionById(@Param("questionId") questionId: string) {
        try {
            return await this.questionService.getQuestionById(questionId);
        } catch (error) {
            throw new BadRequestException(error.response);
        }
    }

    @Post()
    @UseGuards(JwtAuthGuard, QuestionGuard)
    async createQuestion(
        @Body() { title, description, type, isVisible, templateId }: QuestionDto,
    ) {
        try {
            return await this.questionService.createQuestion(
                title,
                description,
                isVisible,
                type,
                templateId
            );
        } catch (error) {
            throw new BadRequestException(error.response);
        }
    }

    @Delete(":questionId")
    @UseGuards(JwtAuthGuard, QuestionGuard)
    async deleteQuestionById(@Param("questionId") questionId: string) {
        try {
            return await this.questionService.deleteQuestionById(questionId);
        } catch (error) {
            throw new BadRequestException(error.response);
        }
    }

    @Put(":questionId")
    @UseGuards(JwtAuthGuard, QuestionGuard)
    async editQuestionById(
        @Param("questionId") questionId: string,
        @Body() { title, description, type, isVisible }: EditQuestionDto
    ) {
        try {
            return await this.questionService.editQuestionById(
                questionId,
                title,
                description,
                isVisible,
                type
            );
        } catch (error) {
            throw new BadRequestException(error.response);
        }
    }

    @Patch("reorder")
    @UseGuards(JwtAuthGuard, QuestionGuard)
    async reorderQuestions(@Body() { questionIds }: ReorderDto) {
        try {
            return await this.questionService.reorderQuestions(questionIds);
        } catch (error) {
            throw new BadRequestException(error.response);
        }
    }
}
