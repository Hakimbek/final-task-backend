import { Injectable, NotFoundException } from "@nestjs/common";
import { Template } from "./template.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class TemplateService {
    constructor(
        @InjectRepository(Template)
        private readonly templateRepository: Repository<Template>,
    ) {}

    getTemplates = (
        term: string = ''
    ): Promise<Template[]> => {
        if (!term.trim()) return this.templateRepository.find();

        return this.templateRepository
            .createQueryBuilder("template")
            .leftJoinAndSelect("template.user", "user")
            .where(
                `to_tsvector(template.title || ' ' || template.description) @@ plainto_tsquery(:term)`,
                { term },
            )
            .getMany();
    }

    getTemplateById = async (
        templateId: string
    ): Promise<Template> => {
        const template = await this.templateRepository.findOne({
            where: { id: templateId },
            relations: ["questions"]
        });

        if (!template) throw new NotFoundException("Template is not found");

        return template;
    }

    createTemplate = async (
        title: string,
        description: string,
        userId: string,
        topic: string,
        tags: string[]
    ): Promise<Template> => {
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

    editTemplateById = async (
        templateId: string,
        title: string,
        description: string,
        topic: string,
        tags: string[]
    ): Promise<{ message: string }> => {
        const template = await this.getTemplateById(templateId);

        template.title = title;
        template.description = description;
        template.topic = topic;
        template.tags = tags;

        await this.templateRepository.save(template);

        return { message: "Template successfully edited" };
    }

    deleteTemplateById = async (
        templateId: string
    ): Promise<{ message: string }> => {
        const result = await this.templateRepository.delete(templateId);

        if (result.affected === 0) throw new NotFoundException("Template is not found or already deleted");

        return { message: "Template successfully deleted" };
    }
}
