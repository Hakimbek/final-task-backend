import { forwardRef, Module } from "@nestjs/common";
import { ResponseController } from "./response.controller";
import { ResponseService } from "./response.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Response } from "./response.entity";
import { JwtModule } from "@nestjs/jwt";
import { AnswerModule } from "../answer/answer.module";
import { UserModule } from "../user/user.module";
import { TemplateModule } from "../template/template.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Response]),
        JwtModule,
        AnswerModule,
        UserModule,
        forwardRef(() => TemplateModule)
    ],
    controllers: [ResponseController],
    providers: [ResponseService],
    exports: [ResponseService],
})
export class ResponseModule {}