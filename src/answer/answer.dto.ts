import { IsNotEmpty } from "class-validator";

export class AnswerDto {
    @IsNotEmpty({ message: 'responseId is required' })
    responseId: string;

    @IsNotEmpty({ message: 'questionId is required' })
    questionId: string;

    @IsNotEmpty({ message: 'answer is required' })
    answer: string;
}