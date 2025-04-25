import { Injectable, NotFoundException, Inject, forwardRef } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm";
import { Response } from "./response.entity";
import { AnswerService } from "../answer/answer.service";
import { UserService } from "../user/user.service";
import { TemplateService } from "../template/template.service";

@Injectable()
export class ResponseService {
    constructor(
        @InjectRepository(Response)
        private readonly responseRepository: Repository<Response>,
        private readonly answerService: AnswerService,
        private readonly userService: UserService,
        @Inject(forwardRef(() => TemplateService))
        private readonly templateService: TemplateService,
    ) {}

    getResponseById = async (responseId: string) => {
        const response = await this.responseRepository.findOne({ where: { id: responseId } });

        if (!response) throw new NotFoundException(`Response not found`);

        return response;
    }

    getResponsesByTemplateId = async (templateId: string) => {
        return await this.responseRepository.find({
            where: {
                template: { id: templateId }
            }
        });
    }

    getResponsesByUserId = async (userId: string) => {
        return await this.responseRepository.find({
            where: {
                user: { id: userId }
            }
        });
    }

    createResponse = async (
        userId: string,
        templateId: string,
        answers: { questionId: string; answer: string }[]
    ) => {
        const createdResponse = this.responseRepository.create({
            user: { id: userId },
            template: { id: templateId }
        });
        const response = await this.responseRepository.save(createdResponse);
        const createAnswers = answers.map(({ questionId, answer }) => {
            return this.answerService.create(response.id, questionId, answer);
        })
        await Promise.all(createAnswers);

        return "Response created successfully";
    }

    editResponseById = async (
        responseId: string,
        answers: { questionId: string; answer: string }[]
    ) => {
        const response = await this.getResponseById(responseId);

        await Promise.all(answers.map(async ({ questionId, answer }) => {
            await this.answerService.updateAnswerById(response.id, questionId, answer)
        }))

        return "Response updated successfully";
    }

    deleteResponseById = async (responseId: string) => {
        const result = await this.responseRepository.delete(responseId);

        if (result.affected === 0) throw new NotFoundException("Response not found or already deleted");

        return "Response successfully deleted";
    }
}
