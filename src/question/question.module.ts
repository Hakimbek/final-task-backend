import { Module } from "@nestjs/common";
import { QuestionController } from "./question.controller";
import { QuestionService } from "./question.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Question } from "./question.entity";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "../user/user.module";

@Module({
    imports: [TypeOrmModule.forFeature([Question]), JwtModule, UserModule],
    controllers: [QuestionController],
    providers: [QuestionService],
    exports: [QuestionService]
})
export class QuestionModule {}