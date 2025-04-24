import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm";
import { Question } from "./question.entity";

@Injectable()
export class QuestionService {
    constructor(
       @InjectRepository(Question)
       private readonly questionRepository: Repository<Question>,
    ) {}

    /**
     * Gets question by question id.
     * @param questionId - question id.
     * @returns A question if exists, otherwise throws an error.
     */
    getQuestionById = async (questionId : string) => {
        const question = await this.questionRepository.findOne({
            where: { id: questionId },
            relations: ['template'],
        });

        if (!question) throw new NotFoundException(`Question with id ${questionId} not found`);

        return question;
    }

    /**
     * Edits question by question id.
     * @param questionId - gets question id from params.
     * @param title - question title.
     * @param description - question description.
     * @param type - question type.
     * @param isVisible - question visibility.
     * @returns A message, if question updated successfully, otherwise throws an error.
     */
    editQuestionById = async (
        questionId: string,
        title: string,
        description: string,
        isVisible: boolean,
        type: string,
    ) => {
        const question = await this.getQuestionById(questionId);

        question.title = title;
        question.description = description;
        question.type = type;
        question.isVisible = isVisible;

        await this.questionRepository.save(question);

        return 'Question is edited successfully';
    }

    /**
     * Creates question.
     * @param title - template title.
     * @param description - template description.
     * @param type - question type.
     * @param isVisible - question visibility.
     * @param templateId - template id what does question belong to.
     * @returns A newly created question.
     */
    createQuestion = async (
        title: string,
        description: string,
        isVisible: boolean,
        type: string,
        templateId: string,
    ) => {
        const questions = await this.questionRepository.find({
            where: {
                template: { id: templateId }
            }
        })

        const createdQuestion = this.questionRepository.create({
            title,
            description,
            isVisible,
            type,
            template: {
                id: templateId,
            },
            order: questions.length + 1
        });

        return await this.questionRepository.save(createdQuestion);
    }

    /**
     * Deletes question by id.
     * @param questionId - question id.
     * @returns A message, if question deleted successfully, otherwise throws an error.
     */
    deleteQuestionById = async (questionId: string) => {
        const result = await this.questionRepository.delete(questionId);

        if (result.affected === 0) throw new NotFoundException('Question not found or already deleted');

        return `Question with ID ${questionId} deleted successfully`;
    }

    reorderQuestions = async (questionIds: string[]) => {
        const updatePromises = questionIds.map((id, index) =>
            this.questionRepository.update(id, { order: index })
        );

        await Promise.all(updatePromises);
        return { message: 'Order updated' };
    }
}