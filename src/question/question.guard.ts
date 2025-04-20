import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";
import { QuestionService } from "./question.service";
import { TemplateService } from "../template/template.service";

@Injectable()
export class QuestionGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly questionService: QuestionService,
        private readonly templateService: TemplateService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization.split(' ')[1];
        const decoded = this.jwtService.decode(token);
        const question = await this.questionService.getQuestionById(request.params.id);

        if (decoded.id !== question.template.user.id) throw new ForbiddenException('You are not the owner of this question');

        return true;
    }
}
