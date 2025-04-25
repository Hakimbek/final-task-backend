import { IsArray, IsNotEmpty } from "class-validator";

export class TemplateDto {
    @IsNotEmpty({ message: "title is required" })
    title: string;

    @IsNotEmpty({ message: "description is required" })
    description: string;

    @IsNotEmpty({ message: "topic is required" })
    topic: string;

    @IsArray({ message: "tags must be an array" })
    tags: string[];
}
