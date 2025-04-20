import { Module } from "@nestjs/common";
import { Template } from "./template.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TemplateController } from "./template.controller";
import { JwtModule } from "@nestjs/jwt";
import { TemplateService } from "./template.service";
import { ResponseModule } from "../response/response.module";
import { AnswerModule } from "../answer/answer.module";
import { UserModule } from "../user/user.module";

@Module({
    imports: [TypeOrmModule.forFeature([Template]), JwtModule, ResponseModule, AnswerModule, UserModule],
    controllers: [TemplateController],
    providers: [TemplateService],
    exports: [TemplateService],
})
export class TemplateModule {}