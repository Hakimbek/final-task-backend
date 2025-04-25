import { IsNotEmpty, IsArray } from "class-validator";

export class ResponseDto {
    @IsNotEmpty({ message: "userId is required" })
    userId: string;

    @IsNotEmpty({ message: "templateId is required" })
    templateId: string;

    @IsArray({ message: "answers must be an array" })
    answers: {
        questionId: string;
        answer: string;
    }[] = []
}
