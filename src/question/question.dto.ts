import { IsNotEmpty } from "class-validator";

export class QuestionDto {
    @IsNotEmpty({ message: 'title is required' })
    title: string;

    @IsNotEmpty({ message: 'description is required' })
    description: string;

    @IsNotEmpty({ message: 'isVisible is required' })
    isVisible: boolean = true;

    @IsNotEmpty({ message: 'type is required' })
    type: string;

    @IsNotEmpty({ message: 'templateId is required' })
    templateId: string;
}

export class EditQuestionDto {
    @IsNotEmpty({ message: 'title is required' })
    title: string;

    @IsNotEmpty({ message: 'description is required' })
    description: string;

    @IsNotEmpty({ message: 'isVisible is required' })
    isVisible: boolean = true;

    @IsNotEmpty({ message: 'type is required' })
    type: string;
}