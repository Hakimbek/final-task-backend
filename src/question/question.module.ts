import { Module } from "@nestjs/common";
import { QuestionController } from "./question.controller";
import { QuestionService } from "./question.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Question } from "./question.entity";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [TypeOrmModule.forFeature([Question]), JwtModule],
    controllers: [QuestionController],
    providers: [QuestionService],
    exports: [QuestionService]
})
export class QuestionModule {}