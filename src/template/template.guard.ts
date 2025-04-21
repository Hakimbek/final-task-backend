import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
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

    /**
     * Checks whether user is admin or the owner of the template. If user is admin, everything is allowed.
     * If user is owner of the template, they also can edit/delete the template.
     * If user is not admin/owner they can only see/fill the template and template questions.
     * They can't delete/edit the template.
     * @param context - used to get user id from token and template id from request params.
     */
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.headers?.authorization.split(' ')[1];
        const userId = this.jwtService.decode(token)?.id;
        const user = await this.userService.findById(userId);
        const template = await this.templateService.getTemplateByID(request?.params?.id);

        if (user?.isAdmin || user?.id === template?.user?.id) return true;

        throw new ForbiddenException('You are not the owner of this template');
    }
}
