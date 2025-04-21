import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";
import { ResponseService } from "./response.service";
import { UserService } from "../user/user.service";

@Injectable()
export class ResponseGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly responseService: ResponseService,
        private readonly userService: UserService
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
        const response = await this.responseService.getResponseById(request?.params?.id)

        if (user?.isAdmin) return true;
        if (user?.id !== response?.template?.user?.id) {
            throw new ForbiddenException('You are not the owner of this template');
        }

        return true;
    }
}
