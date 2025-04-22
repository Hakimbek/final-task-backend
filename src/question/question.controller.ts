import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, Res, HttpStatus } from "@nestjs/common";
import { QuestionService } from "./question.service";
import { JwtAuthGuard } from "../jwt/jwt-auth.guard";
import { QuestionDto, EditQuestionDto } from "./question.dto";
import { Response } from "express";
import { QuestionGuard } from "./question.guard";

@Controller('question')
export class QuestionController {
    constructor(
        private readonly questionService: QuestionService
    ) {}

    /**
     * Gets question by question id. Only the owner and admin are allowed.
     * @param questionId - gets question id from params.
     * @param res - response.
     */
    @Get(':questionId')
    @UseGuards(JwtAuthGuard, QuestionGuard)
    async getQuestionById(@Param('questionId') questionId: string, @Res() res: Response) {
        try {
            const question = await this.questionService.getQuestionById(questionId);
            res.status(HttpStatus.OK).send(question);
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).send(error);
        }
    }

    /**
     * Creates question. Only the owner and admin are allowed.
         * @param templateId - template id what does question belong to.
     * @param title - question title.
     * @param description - question description.
     * @param type - question type.
     * @param isVisible - question visibility.
     * @param res - response.
     */
    @Post()
    @UseGuards(JwtAuthGuard, QuestionGuard)
    async createQuestion(
        @Body() { title, description, type, isVisible, templateId }: QuestionDto,
        @Res() res: Response
    ) {
        try {
            const question = await this.questionService.createQuestion(
                title,
                description,
                isVisible,
                type,
                templateId
            );
            res.status(HttpStatus.OK).send(question);
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).send(error);
        }
    }

    /**
     * Deletes question by question id. Only the owner and admin are allowed.
     * @param questionId - gets question id from params.
     * @param res - response.
     */
    @Delete(':questionId')
    @UseGuards(JwtAuthGuard, QuestionGuard)
    async deleteQuestionById(@Param('questionId') questionId: string, @Res() res: Response) {
        try {
            const message = await this.questionService.deleteQuestionById(questionId);
            res.status(HttpStatus.OK).send({ message });
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).send(error);
        }
    }

    /**
     * Edits question by question id. Only the owner and admin are allowed.
     * @param questionId - gets question id from params.
     * @param title - question title.
     * @param description - question description.
     * @param type - question type.
     * @param isVisible - question visibility.
     * @param res - response.
     */
    @Put(':questionId')
    @UseGuards(JwtAuthGuard, QuestionGuard)
    async editQuestionById(
        @Param('questionId') questionId: string,
        @Body() { title, description, type, isVisible }: EditQuestionDto,
        @Res() res: Response
    ) {
        try {
            const message = await this.questionService.editQuestionById(
                questionId,
                title,
                description,
                isVisible,
                type
            );
            res.status(HttpStatus.OK).send({ message });
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).send(error);
        }
    }
}