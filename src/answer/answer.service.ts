import { ConflictException, Injectable } from "@nestjs/common";
import { Answer } from "./answer.entity";
import { Repository } from "typeorm";
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AnswerService {
    constructor(
        @InjectRepository(Answer)
        private readonly answerRepository: Repository<Answer>,
    ) {}

    getAnswerByResponseAndQuestionId = async (responseId: string, questionId: string) => {
        return await this.answerRepository.findOne({
            where: {
                response: {
                    id: responseId
                },
                question: {
                    id: questionId
                }
            }
        });
    }

    create = async (responseId: string, questionId: string, answer: string) => {
        const createdAnswer = this.answerRepository.create({
            response: {
                id: responseId
            },
            question: {
                id: questionId
            },
            value: answer
        });

        return await this.answerRepository.save(createdAnswer);
    }

    updateAnswerById = async (responseId: string, questionId: string, answer: string) => {
        const existedAnswer = await this.getAnswerByResponseAndQuestionId(responseId, questionId);

        if (!existedAnswer) throw new ConflictException("Cannot update answer");

        existedAnswer.value = answer;

        await this.answerRepository.save(existedAnswer);
    }
}
