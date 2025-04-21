import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import { TemplateService } from "../template/template.service";

@Injectable()
export class ResponseGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly templateService: TemplateService
    ) {}

    /**
     * Checks whether user is admin or the owner of the template. If user is admin, everything is allowed.
     * If user is owner of the template, they also can edit/delete the response.
     * If user is not admin/owner of the template, they can't do anything.
     * @param context - used to get user id from token and response id from request params.
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
