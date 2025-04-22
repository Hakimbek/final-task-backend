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

    /**
     * Gets all responses.
     * @returns An array of responses, if responses exist, otherwise empty array.
     */
    // getResponses = async () => await this.responseRepository.find();

    /**
     * Gets response by response id.
     * @param responseId - response id.
     * @returns A response, if response exists, otherwise throws an error.
     */
    getResponseById = async (responseId: string) => {
        const response = await this.responseRepository.findOne({ where: { id: responseId } });

        if (!response) throw new NotFoundException(`Response with id ${responseId} not found`);

        return response;
    }

    /**
     * Gets responses by template id.
     * @param templateId - template id.
     * @returns An array of responses, if responses exist, otherwise empty array.
     */
    getResponsesByTemplateId = async (templateId: string) => {
        return await this.responseRepository.find({
            where: {
                template: { id: templateId }
            }
        });
    }

    /**
     * Gets response by user and template id.
     * @param userId - user id.
     * @param templateId - template id.
     * @returns A response, if response exists, otherwise null.
     */
    getResponseByUserAndTemplateId = async (userId: string, templateId: string) => {
        return await this.responseRepository.findOne({
            where: {
                user: { id: userId },
                template: { id: templateId }
            }
        });
    }

    /**
     * Creates or updates response. If response is not existed, a new response is created by user and template id.
     * Then, new answers are created using newly created response id. If response exists,
     * we get response using user and template id. Then, we try to get answers using response id.
     * If answer exists, it is updated. If not, new answer is created.
     * @param userId - user id.
     * @param templateId - template id.
     * @param answers - the array of question id and answer.
     * @returns A message, if response deleted successfully, otherwise throws an error.
     */
    createOrUpdateResponse = async  (
        userId: string,
        templateId: string,
        answers: { questionId: string; answer: string }[]
    ) => {
        const response = await this.getResponseByUserAndTemplateId(userId, templateId);

        if (response) {
            await Promise.all(answers.map(async ({ questionId, answer }) => {
                const isAnswerExists = await this.answerService.getAnswerByResponseAndQuestionId(
                    response.id,
                    questionId
                );

                isAnswerExists
                    ? await this.answerService.updateAnswerById(response.id, questionId, answer)
                    : await this.answerService.create(response.id, questionId, answer);
            }))
        } else {
            const createdResponse = this.responseRepository.create({
                user: { id: userId },
                template: { id: templateId }
            });
            const response = await this.responseRepository.save(createdResponse);
            const createAnswers = answers.map(({ questionId, answer }) => {
                return this.answerService.create(response.id, questionId, answer);
            })
            await Promise.all(createAnswers);
        }

        return 'Response created successfully';
    }

    /**
     * Deletes response by id.
     * @param responseId - response id.
     * @returns A message, if response deleted successfully, otherwise throws an error.
     */
    deleteResponseById = async (responseId: string) => {
        const result = await this.responseRepository.delete(responseId);

        if (result.affected === 0) throw new NotFoundException('Response not found or already deleted');

        return `Response with ID ${responseId} deleted successfully`;
    }
}