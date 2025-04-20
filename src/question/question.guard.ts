import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";
import { QuestionService } from "./question.service";
import { UserService } from "../user/user.service";

@Injectable()
export class QuestionGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly questionService: QuestionService,
        private readonly userService: UserService,
    ) {}

    /**
     * Checks whether user is admin or the owner of the question. If user is admin, everything is allowed.
     * If user is owner of the question, they also can edit/delete the question.
     * If user is not admin/owner they can only see/fill the question.
     * They can't delete/edit the question.
     * @param context - used to get user id from token and template id from request params.
     */
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.headers?.authorization.split(' ')[1];
        const userId = this.jwtService.decode(token)?.id;
        const user = await this.userService.findById(userId);
        const question = await this.questionService.getQuestionById(request?.params?.id);

        if (user?.isAdmin) return true;
        if (user?.id !== question?.template?.user?.id) {
            throw new ForbiddenException('You are not the owner of this question');
        }

        return true;
    }
}
