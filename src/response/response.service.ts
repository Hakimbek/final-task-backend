import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm";
import { Response } from "./response.entity";
import { AnswerService } from "../answer/answer.service";

@Injectable()
export class ResponseService {
    constructor(
        @InjectRepository(Response)
        private readonly responseRepository: Repository<Response>,
        private readonly answerService: AnswerService
    ) {}

    getAllResponses = async () => await this.responseRepository.find();

    getResponseById = async (id: string) => {
        const response = await this.responseRepository.findOne({ where: { id } });

        if (!response) throw new NotFoundException(`Response with id ${id} not found`);

        return response;
    }

    getResponseByUserAndTemplateId = async (userId: string, templateId: string) => {
        return await this.responseRepository.findOne({
            where: {
                user: {
                    id: userId
                },
                template: {
                    id: templateId
                }
            }
        });
    }

    create = async  (
        userId: string,
        templateId: string,
        answers: { questionId: string; answer: string }[]
    ) => {
        const response = await this.getResponseByUserAndTemplateId(userId, templateId);

        if (response) {
            await Promise.all(answers.map(async ({ questionId, answer }) => {
                const isAnswerExists = await this.answerService.getAnswerByResponseAndQuestionId(response.id, questionId);

                isAnswerExists
                    ? await this.answerService.updateAnswerById(response.id, questionId, answer)
                    : await this.answerService.create(response.id, questionId, answer);
            }))
        } else {
            const createdResponse = this.responseRepository.create({
                user: {
                    id: userId
                },
                template: {
                    id: templateId
                }
            });
            const response = await this.responseRepository.save(createdResponse);
            const createAnswers = answers.map(({ questionId, answer }) => {
                return this.answerService.create(response.id, questionId, answer);
            })
            await Promise.all(createAnswers);
        }

        return `Response created successfully`;
    }

    deleteById = async (id: string) => {
        const result = await this.responseRepository.delete(id);

        if (result.affected === 0) throw new NotFoundException('Response not found or already deleted');

        return `Response with ID ${id} deleted successfully`;
    }
}