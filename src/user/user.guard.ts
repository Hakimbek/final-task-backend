import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";
import { UserService } from "./user.service";

@Injectable()
export class UserGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization.split(' ')[1];
        const decoded = this.jwtService.decode(token);
        const user = await this.userService.findById(request.params.id);

        if (user.isAdmin) return true;
        if (decoded.id !== user.id) throw new ForbiddenException('You are not the owner of this user');

        return true;
    }
}
