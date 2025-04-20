import { Injectable, NotFoundException } from "@nestjs/common";
import { Template } from "./template.entity";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm";
import { ResponseService } from "../response/response.service";
import { AnswerService } from "../answer/answer.service";

@Injectable()
export class TemplateService {
    constructor(
        @InjectRepository(Template)
        private readonly templateRepository: Repository<Template>,
        private readonly responseService: ResponseService,
        private readonly answerService: AnswerService,
    ) {}

    /**
     * Gets templates by search term. If search term is empty, gets all templates.
     * In addition, combine template data with user data who created this template.
     * @param term - search term.
     * @returns An array of templates if search term matches, otherwise empty array.
     */
    getTemplates = async (term: string = '') => {
        if (!term.trim()) return await this.templateRepository.find({ relations: ['user'] });

        return await this.templateRepository
            .createQueryBuilder("template")
            .leftJoinAndSelect("template.user", "user")
            .where(
                `to_tsvector(template.title || ' ' || template.description) @@ plainto_tsquery(:term)`,
                { term },
            )
            .getMany();
    }

    /**
     * Gets template by template id.
     * @param templateId - template id.
     * @returns A template if exists, otherwise throws an error.
     */
    getTemplateByID = async (templateId: string) => {
        const template = await this.templateRepository.findOne({ where: { id: templateId } });

        if (!template) throw new NotFoundException(`Template with id ${templateId} is not found`);

        return template;
    }

    /**
     * Gets template by template id and user id. Plus, gets questions related to this template.
     * And of user filled out this template before, gets answers of this user to these questions.
     * Otherwise, returns questions with answer field, which is empty string.
     * @param templateId - template id.
     * @param userId - user id.
     * @returns A template if exists, otherwise throws an error.
     */
    getTemplateByTemplateAndUserId = async (templateId: string, userId: string) => {
        const template = await this.templateRepository.findOne({
            where: { id: templateId },
            relations: ['user', 'questions']
        });

        if (!template) throw new NotFoundException(`Template with id ${templateId} is not found`);

        let questions = template.questions.map(question => ({ ...question, answer: '' }));
        const response = await this.responseService.getResponseByUserAndTemplateId(userId, template.id);

        if (response) {
            questions = await Promise.all(questions.map(async (question) => {
                const answer = await this.answerService.getAnswerByResponseAndQuestionId(response.id, question.id);

                return { ...question, answer: answer?.value || '' }
            }))

            return { ...template, questions };
        }

        return { ...template, questions };
    }

    /**
     * Edits template data by template id.
     * @param templateId - template id.
     * @param title - template title.
     * @param description - template description.
     * @param topic - template topic.
     * @param tags - template tags.
     * @returns A message, if template updated successfully, otherwise throws an error.
     */
    editTemplateById = async (
        templateId: string,
        title: string,
        description: string,
        topic: string,
        tags: string[]
    ) => {
        const template = await this.getTemplateByID(templateId);

        template.title = title;
        template.description = description;
        template.topic = topic;
        template.tags = tags;

        await this.templateRepository.save(template);

        return 'Template is edited successfully';
    }

    /**
     * Creates template.
     * @param title - template title.
     * @param description - template description.
     * @param topic - template topic.
     * @param tags - template tags.
     * @param userId - template userId.
     * @returns A newly created template.
     */
    createTemplate = async (
        title: string,
        description: string,
        userId: string,
        topic: string,
        tags: string[]
    ) => {
        const createdTemplate = this.templateRepository.create({
            title,
            description,
            user: {
                id: userId
            },
            topic,
            tags
        });

        return await this.templateRepository.save(createdTemplate);
    }

    /**
     * Deletes template by id.
     * @param templateId - template id.
     * @returns A message, if template deleted successfully, otherwise throws an error.
     */
    deleteTemplateById = async (templateId: string) => {
        const result = await this.templateRepository.delete(templateId);

        if (result.affected === 0) throw new NotFoundException('Template is not found or already deleted');

        return `Template with ID ${templateId} is deleted successfully`;
    }
}