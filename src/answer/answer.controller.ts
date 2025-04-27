import { BadRequestException, Controller, Param, UseGuards } from "@nestjs/common";
import { AnswerService } from "./answer.service";
import { Get } from "@nestjs/common";
import { JwtAuthGuard } from "../jwt/jwt-auth.guard";

@Controller("answer")
export class AnswerController {
    constructor(private readonly answerService: AnswerService) {}

    @Get("response/:responseId/question/:questionId")
    @UseGuards(JwtAuthGuard)
    async getAnswerByResponseAndQuestionId(
        @Param("userId") responseId: string,
        @Param("questionId") questionId: string
    ) {
        try {
            return await this.answerService.getAnswerByResponseAndQuestionId(responseId, questionId);
        } catch (error) {
            throw new BadRequestException(error.response);
        }
    }
}
