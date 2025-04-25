import { Module } from "@nestjs/common";
import { AnswerService } from "./answer.service";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Answer } from "./answer.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Answer]), JwtModule],
    providers: [AnswerService],
    exports: [AnswerService],
})
export class AnswerModule {}
