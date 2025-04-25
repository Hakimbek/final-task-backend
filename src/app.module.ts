import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database/database.module";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { TemplateModule } from "./template/template.module";
import { TopicModule } from "./topic/topic.module";
import { QuestionModule } from "./question/question.module";
import { ResponseModule } from "./response/response.module";
import { AnswerModule } from "./answer/answer.module";
import { S3Module } from "./s3/s3.module";

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    AuthModule,
    TemplateModule,
    TopicModule,
    QuestionModule,
    ResponseModule,
    AnswerModule,
    S3Module,
  ]
})
export class AppModule {}
