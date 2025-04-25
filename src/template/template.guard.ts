import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TemplateService } from "./template.service";
import { UserService } from "../user/user.service";

@Injectable()
export class TemplateGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly templateService: TemplateService,
        private readonly userService: UserService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.headers?.authorization.split(' ')[1];
        const userId = this.jwtService.decode(token)?.id;
        const user = await this.userService.findById(userId);
        const template = await this.templateService.getTemplateById(request?.params?.templateId);
        const isTemplateOwner = user?.id === template?.user?.id;

        if (user?.isAdmin || isTemplateOwner) return true;

        throw new ForbiddenException("You are not the owner of this template");
    }
}
