import { ConflictException, Injectable } from "@nestjs/common";
import { Answer } from "./answer.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class AnswerService {
    constructor(
        @InjectRepository(Answer)
        private readonly answerRepository: Repository<Answer>,
    ) {}

    getAnswerByResponseAndQuestionId = (
        responseId: string,
        questionId: string
    ): Promise<Answer | null> => {
        return this.answerRepository.findOne({
            where: {
                response: { id: responseId },
                question: { id: questionId }
            }
        });
    }

    createAnswer = (
        responseId: string,
        questionId: string,
        answer: string
    ): Promise<Answer> => {
        const createdAnswer = this.answerRepository.create({
            response: { id: responseId },
            question: { id: questionId },
            value: answer
        });

        return this.answerRepository.save(createdAnswer);
    }

    updateAnswerById = async (
        responseId: string,
        questionId: string,
        answer: string
    ): Promise<Answer> => {
        const existedAnswer = await this.getAnswerByResponseAndQuestionId(responseId, questionId);

        if (!existedAnswer) throw new ConflictException("Cannot update answer");

        existedAnswer.value = answer;

        return this.answerRepository.save(existedAnswer);
    }
}
