import {
    ConflictException,
    Injectable,
    NotFoundException,
    Inject,
    forwardRef,
    BadRequestException,
    ForbiddenException
} from "@nestjs/common";
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

    getResponsesByTemplateId = (templateId: string) => {
        return this.responseRepository.find({
            where: {
                template: { id: templateId }
            }
        });
    }

    getResponsesByUserId = (userId: string) => {
        return this.responseRepository.find({
            where: {
                user: { id: userId }
            }
        });
    }

    getResponseByUserAndTemplateId = (
        userId: string,
        templateId: string
    ): Promise<Response | null> => {
        return this.responseRepository.findOne({
            where: {
                user: { id: userId },
                template: { id: templateId }
            }
        });
    }

    createResponse = async (
        userId: string,
        templateId: string,
        answers: { questionId: string; answer: string }[],
        authUserId: string
    ) => {
        const user = await this.userService.findById(authUserId);

        if (userId !== user?.id) throw new ForbiddenException("Action is not allowed");

        const isResponseExist = await this.getResponseByUserAndTemplateId(userId, templateId);

        if (answers.length === 0) throw new BadRequestException("There is no answer");
        if (isResponseExist) throw new ConflictException("Response already exists");

        const createdResponse = this.responseRepository.create({
            user: { id: userId },
            template: { id: templateId }
        });
        const response = await this.responseRepository.save(createdResponse);
        const createAnswers = answers.map(({ questionId, answer }) => {
            return this.answerService.create(response.id, questionId, answer);
        })
        await Promise.all(createAnswers);

        return { message: "Response created successfully" };
    }

    editResponseById = async (
        responseId: string,
        answers: { questionId: string; answer: string }[]
    ) => {
        const response = await this.getResponseById(responseId);

        await Promise.all(answers.map(async ({ questionId, answer }) => {
            await this.answerService.updateAnswerById(response.id, questionId, answer)
        }))

        return { message: "Response updated successfully" };
    }

    deleteResponseById = async (responseId: string) => {
        const result = await this.responseRepository.delete(responseId);

        if (result.affected === 0) throw new NotFoundException("Response not found or already deleted");

        return { message: "Response successfully deleted" };
    }
}
