import { Body, Controller, Get, Post, UseGuards, Headers, Query, Param, Put, Delete, BadRequestException} from "@nestjs/common";
import { TemplateService } from "./template.service";
import { TemplateDto } from "./template.dto";
import { JwtAuthGuard } from "../jwt/jwt-auth.guard";
import { JwtService } from "@nestjs/jwt";
import { TemplateGuard } from "./template.guard";

@Controller("template")
export class TemplateController {
    constructor(
        private readonly templateService: TemplateService,
        private readonly jwtService: JwtService
    ) {}

    @Get()
    async getTemplates(@Query("search") search: string) {
        try {
            return await this.templateService.getTemplates(search);
        } catch (error) {
            throw new BadRequestException(error.response);
        }
    }

    @Get(":templateId")
    async getTemplateById(@Param("templateId") templateId: string,) {
        try {
            return await this.templateService.getTemplateById(templateId);
        } catch (error) {
            throw new BadRequestException(error.response);
        }
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async createTemplate(
        @Body() { title, description, topic, tags }: TemplateDto,
        @Headers("authorization") authHeader: string,
    ) {
        try {
            const userId = this.jwtService.decode(authHeader.split(" ")[1]).id;
            return await this.templateService.createTemplate(
                title,
                description,
                userId,
                topic,
                tags
            );
        } catch (error) {
            throw new BadRequestException(error.response);
        }
    }

    @Put(":templateId")
    @UseGuards(JwtAuthGuard, TemplateGuard)
    async editTemplateById(
        @Param("templateId") templateId: string,
        @Body() { title, description, topic, tags }: TemplateDto,
    ) {
        try {
            return await this.templateService.editTemplateById(
                templateId,
                title,
                description,
                topic,
                tags
            );
        } catch (error) {
            throw new BadRequestException(error.response);
        }
    }

    @Delete(":templateId")
    @UseGuards(JwtAuthGuard, TemplateGuard)
    async deleteTemplateById(@Param("templateId") templateId: string) {
        try {
            return await this.templateService.deleteTemplateById(templateId);
        } catch (error) {
            throw new BadRequestException(error.response);
        }
    }
}
