import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import { TemplateService } from "../template/template.service";
import { ResponseService } from "./response.service";

@Injectable()
export class ResponseGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly templateService: TemplateService,
        private readonly responseService: ResponseService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.headers?.authorization.split(' ')[1];
        const userId = this.jwtService.decode(token)?.id;
        const user = await this.userService.findById(userId);

        if (user?.isAdmin) return true;

        if (request?.params?.templateId) {
            const template = await this.templateService.getTemplateById(request?.params?.templateId);

            if (user?.id === template?.user?.id) return true;
        }

        if (request?.params?.userId) {
            if (user?.id === request?.params?.userId) return true;
        }

        if (request?.params?.responseId) {
            const response = await this.responseService.getResponseById(request?.params?.responseId);

            if (user?.id === response?.template?.user?.id) return true;
        }

        throw new ForbiddenException("Action is not allowed");
    }
}
