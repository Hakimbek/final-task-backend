import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { JwtModule } from "@nestjs/jwt";
import { S3Module } from "../s3/s3.module";

@Module({
    imports: [TypeOrmModule.forFeature([User]), JwtModule, S3Module],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
