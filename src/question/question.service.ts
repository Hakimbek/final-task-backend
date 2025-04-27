import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Question } from "./question.entity";

@Injectable()
export class QuestionService {
    constructor(
       @InjectRepository(Question)
       private readonly questionRepository: Repository<Question>,
    ) {}

    getQuestionById = async (
        questionId : string
    ): Promise<Question> => {
        const question = await this.questionRepository.findOne({
            where: { id: questionId },
            relations: ["template"],
        });

        if (!question) throw new NotFoundException("Question not found");

        return question;
    }

    createQuestion = async (
        title: string,
        description: string,
        isVisible: boolean,
        type: string,
        templateId: string,
        options: string[],
    ): Promise<Question> => {
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
            options,
            order: questions.length + 1,
            template: {
                id: templateId,
            }
        });

        return this.questionRepository.save(createdQuestion);
    }

    editQuestionById = async (
        questionId: string,
        title: string,
        description: string,
        isVisible: boolean,
        type: string,
        options: string[],
    ): Promise<{ message: string }> => {
        const question = await this.getQuestionById(questionId);

        question.title = title;
        question.description = description;
        question.type = type;
        question.isVisible = isVisible;
        question.options = options;

        await this.questionRepository.save(question);

        return { message: "Question successfully edited" };
    }

    deleteQuestionById = async (
        questionId: string
    ): Promise<{ message: string }> => {
        const result = await this.questionRepository.delete(questionId);

        if (result.affected === 0) throw new NotFoundException("Question not found or already deleted");

        return { message: "Question successfully deleted" };
    }

    reorderQuestions = async (
        questionIds: string[]
    ): Promise<{ message: string }> => {
        const updatePromises = questionIds.map((id, index) =>
            this.questionRepository.update(id, { order: index + 1 })
        );

        await Promise.all(updatePromises);

        return { message: "Order updated" };
    }
}
