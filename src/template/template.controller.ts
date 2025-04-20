import {
    Body,
    Controller,
    Get,
    Post,
    UseGuards,
    Headers,
    Query,
    Param,
    Put,
    Delete,
    Res,
    HttpStatus
} from "@nestjs/common";
import { TemplateService } from "./template.service";
import { TemplateDto } from "./template.dto";
import { JwtAuthGuard } from "../jwt/jwt-auth.guard";
import { JwtService } from "@nestjs/jwt";
import { TemplateGuard } from "./template.guard";
import { Response } from 'express';

@Controller('template')
export class TemplateController {
    constructor(
        private readonly templateService: TemplateService,
        private readonly jwtService: JwtService
    ) {}

    /**
     * Gets templates by search term. If search term is empty, gets all templates.
     * In addition, combine template data with user data who created this template.
     * @param search - gets search term from query. This path is open.
     * @param res - response.
     */
    @Get()
    async getTemplates(@Query('search') search: string, @Res() res: Response) {
        try {
            const templates = await this.templateService.getTemplates(search);
            res.status(HttpStatus.OK).send(templates);
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).send(error);
        }
    }

    /**
     * Gets template by user id and template id. This path is open.
     * @param templateId - gets template id from params.
     * @param authHeader - gets user id from token.
     * @param res - response.
     */
    @Get(':templateId')
    async getTemplateById(
        @Param('templateId') templateId: string,
        @Headers('authorization') authHeader: string,
        @Res() res: Response
    ) {
        try {
            const userId = this.jwtService.decode(authHeader.split(" ")[1])?.id;
            const template = await this.templateService.getTemplateByID(
                templateId,
                userId
            );
            res.status(HttpStatus.OK).send(template);
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).send(error);
        }
    }

    /**
     * Edits template by template id. Only the owner and admin are allowed.
     * @param templateId - gets template id from params.
     * @param title - template title.
     * @param description - template description.
     * @param topic - template topic.
     * @param tags - template tags.
     * @param res - response.
     */
    @Put(':templateId')
    @UseGuards(JwtAuthGuard, TemplateGuard)
    async editTemplateById(
        @Param('templateId') templateId: string,
        @Body() { title, description, topic, tags }: TemplateDto,
        @Res() res: Response
    ) {
        try {
            const message = await this.templateService.editTemplateById(
                templateId,
                title,
                description,
                topic,
                tags
            );
            res.status(HttpStatus.OK).send({ message });
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).send(error);
        }
    }

    /**
     * Creates template. Only authorized users are allowed.
     * @param title - template title.
     * @param description - template description.
     * @param topic - template topic.
     * @param tags - template tags.
     * @param authHeader - gets user id from token.
     * @param res - response.
     */
    @Post()
    @UseGuards(JwtAuthGuard)
    async createTemplate(
        @Body() { title, description, topic, tags }: TemplateDto,
        @Headers('authorization') authHeader: string,
        @Res() res: Response
    ) {
        try {
            const userId = this.jwtService.decode(authHeader.split(" ")[1]).id;
            const template = await this.templateService.createTemplate(
                title,
                description,
                userId,
                topic,
                tags
            );
            res.status(HttpStatus.OK).send(template);
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).send(error);
        }
    }

    /**
     * Deletes template by template id. Only the owner and admin are allowed.
     * @param templateId - gets template id from params.
     * @param res - response.
     */
    @Delete(':templateId')
    @UseGuards(JwtAuthGuard, TemplateGuard)
    async deleteTemplateById(@Param('templateId') templateId: string, @Res() res: Response) {
        try {
            const message = await this.templateService.deleteTemplateById(templateId);
            res.status(HttpStatus.OK).send({ message });
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).send(error);
        }
    }
}
