import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Put,
    UseGuards,
    BadRequestException
} from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtAuthGuard } from "../jwt/jwt-auth.guard";
import { UserGuard } from "./user.guard";
import { UpdateUserDto, UpdateImageDto } from "./user.dto";
import { AdminGuard } from "./admin.guard";

@Controller("user")
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Get()
    @UseGuards(JwtAuthGuard, AdminGuard)
    async getAllUsers() {
        try {
            return await this.userService.getAllUsers();
        } catch (error) {
            throw new BadRequestException(error.response);
        }
    }

    @Get(":userId")
    @UseGuards(JwtAuthGuard, UserGuard)
    async getUserById(@Param("userId") userId: string) {
        try {
            return await this.userService.findById(userId);
        } catch (error) {
            throw new BadRequestException(error.response);
        }
    }

    @Put("upload/:userId")
    @UseGuards(JwtAuthGuard, UserGuard)
    async uploadImage(
        @Param("userId") userId: string,
        @Body() { url }: UpdateImageDto
    ) {
        try {
            return await this.userService.uploadImage(url, userId);
        } catch (error) {
            throw new BadRequestException(error.response);
        }
    }

    @Put("edit/:userId")
    @UseGuards(JwtAuthGuard, UserGuard)
    async updateById(
        @Param("userId") userId: string,
        @Body() { firstname, lastname }: UpdateUserDto
    ) {
        try {
            return await this.userService.updateById(userId, firstname, lastname);
        } catch (error) {
            throw new BadRequestException(error.response);
        }
    }

    @Delete(":userId")
    @UseGuards(JwtAuthGuard, UserGuard)
    async deleteById(@Param("userId") userId: string) {
        try {
            return await this.userService.deleteById(userId);
        } catch (error) {
            throw new BadRequestException(error.response);
        }
    }

    @Delete()
    @UseGuards(JwtAuthGuard, AdminGuard)
    async deleteByIds(@Body("userIds") userIds: string[]) {
        try {
            return await this.userService.deleteByIds(userIds);
        } catch (error) {
            throw new BadRequestException(error.response);
        }
    }

    @Put("activate")
    @UseGuards(JwtAuthGuard, AdminGuard)
    async activateUserByIds(@Body("userIds") userIds: string[]) {
        try {
            return await this.userService.changeStatusByIds(userIds, true);
        } catch (error) {
            throw new BadRequestException(error.response);
        }
    }

    @Put("deactivate")
    @UseGuards(JwtAuthGuard, AdminGuard)
    async deactivateUserByIds(@Body("userIds") userIds: string[]) {
        try {
            return await this.userService.changeStatusByIds(userIds, false);
        } catch (error) {
            throw new BadRequestException(error.response);
        }
    }

    @Put("admin")
    @UseGuards(JwtAuthGuard, AdminGuard)
    async makeUserAdminByIds(@Body("userIds") userIds: string[]) {
        try {
            return await this.userService.changeRoleByIds(userIds, true);
        } catch (error) {
            throw new BadRequestException(error.response);
        }
    }

    @Put("user")
    @UseGuards(JwtAuthGuard, AdminGuard)
    async makeUserUserByIds(@Body("userIds") userIds: string[]) {
        try {
            return await this.userService.changeRoleByIds(userIds, false);
        } catch (error) {
            throw new BadRequestException(error.response);
        }
    }
}
