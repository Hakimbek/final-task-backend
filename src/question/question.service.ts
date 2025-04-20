import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm";
import { Question } from "./question.entity";

@Injectable()
export class QuestionService {
    constructor(
       @InjectRepository(Question)
       private readonly questionRepository: Repository<Question>,
    ) {}

    getQuestionById = async (id : string) => {
        const question = await this.questionRepository.findOne({ where: { id } });

        if (!question) throw new NotFoundException(`Question with id ${id} not found`);

        return question;
    }

    getQuestionsByTemplateId = async (templateId: string) => {
        return await this.questionRepository.find({
            where: {
                template: {
                    id: templateId
                }
            }
        });
    }

    editQuestionById = async (
        id: string,
        title: string,
        description: string,
        isVisible: boolean,
        type: string,
    ) => {
        try {
            const question = await this.getQuestionById(id);

            question.title = title;
            question.description = description;
            question.type = type;
            question.isVisible = isVisible;

            await this.questionRepository.save(question);
            return { message: 'Question is edited successfully' };
        } catch {
            throw new InternalServerErrorException('Failed to update user');
        }
    }

    create = async (
        title: string,
        description: string,
        isVisible: boolean,
        type: string,
        templateId: string,
    ) => {
        const createdQuestion = this.questionRepository.create({
            title,
            description,
            isVisible,
            type,
            template: {
                id: templateId,
            }
        });

        return await this.questionRepository.save(createdQuestion);
    }

    deleteById = async (id: string) => {
        const result = await this.questionRepository.delete(id);

        if (result.affected === 0) throw new NotFoundException('Question not found or already deleted');

        return { message: `Question with ID ${id} deleted successfully` };
    }
}