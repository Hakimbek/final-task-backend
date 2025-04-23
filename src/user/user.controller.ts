import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Put,
    UseGuards,
    Res,
    HttpStatus,
    Headers,
    ForbiddenException
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { UserGuard } from "./user.guard";
import { UpdateUserDto, UpdateImageDto } from "./user.dto";
import { Response } from "express";
import { JwtService } from "@nestjs/jwt";

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    async getAllUsers(
        @Res() res: Response,
        @Headers('authorization') authHeader: string
    ) {
        try {
            const token = this.jwtService.decode(authHeader?.split(' ')[1]);
            const user = await this.userService.findById(token?.id);

            if (!user?.isAdmin) throw new ForbiddenException('Not allowed');

            const users = await this.userService.getAllUsers();
            res.status(HttpStatus.OK).send(users);
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).send(error);
        }
    }

    @Get(':userId')
    @UseGuards(JwtAuthGuard, UserGuard)
    async getById(@Param('userId') userId: string, @Res() res: Response) {
        try {
            const user = await this.userService.findById(userId);
            res.status(HttpStatus.OK).send(user);
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).send(error);
        }
    }

    @Put('upload/:userId')
    @UseGuards(JwtAuthGuard, UserGuard)
    async uploadImage(@Param('userId') userId: string, @Body() { url }: UpdateImageDto, @Res() res: Response) {
        try {
            const message = await this.userService.uploadImage(url, userId);
            res.status(HttpStatus.OK).send({ message });
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).send(error);
        }
    }

    @Put('edit/:userId')
    @UseGuards(JwtAuthGuard, UserGuard)
    async updateById(@Param('userId') userId: string, @Body() { firstname, lastname }: UpdateUserDto, @Res() res: Response) {
        try {
            const message = await this.userService.updateById(userId, firstname, lastname);
            res.status(HttpStatus.OK).send({ message });
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).send(error);
        }
    }

    @Delete(':userId')
    @UseGuards(JwtAuthGuard, UserGuard)
    async deleteById(@Param('userId') userId: string, @Res() res: Response) {
        try {
            const message = await this.userService.deleteById(userId);
            res.status(HttpStatus.OK).send({ message });
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).send(error);
        }
    }

    @Delete()
    @UseGuards(JwtAuthGuard)
    async deleteByIds(
        @Body('userIds') userIds: string[],
        @Res() res: Response,
        @Headers('authorization') authHeader: string
        ) {
        try {
            const token = this.jwtService.decode(authHeader?.split(' ')[1]);
            const user = await this.userService.findById(token?.id);

            if (!user?.isAdmin) throw new ForbiddenException('Not allowed');

            await this.userService.deleteByIds(userIds);
            res.status(HttpStatus.OK).send({ message: 'Successfully deleted' });
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).send(error);
        }
    }

    @Put('activate')
    @UseGuards(JwtAuthGuard)
    async activateUserByIds(
        @Body('userIds') userIds: string[],
        @Res() res: Response,
        @Headers('authorization') authHeader: string
    ) {
        try {
            const token = this.jwtService.decode(authHeader?.split(' ')[1]);
            const user = await this.userService.findById(token?.id);

            if (!user?.isAdmin) throw new ForbiddenException('Not allowed');

            await this.userService.changeStatusByIds(userIds, true);
            res.status(HttpStatus.OK).send({ message: 'Successfully activated' });
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).send(error);
        }
    }

    @Put('deactivate')
    @UseGuards(JwtAuthGuard)
    async deactivateUserByIds(
        @Body('userIds') userIds: string[],
        @Res() res: Response,
        @Headers('authorization') authHeader: string
    ) {
        try {
            const token = this.jwtService.decode(authHeader?.split(' ')[1]);
            const user = await this.userService.findById(token?.id);
            if (!user?.isAdmin) throw new ForbiddenException('Not allowed');

            await this.userService.changeStatusByIds(userIds, false);
            res.status(HttpStatus.OK).send({ message: 'Successfully deactivated' });
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).send(error);
        }
    }

    @Put('admin')
    @UseGuards(JwtAuthGuard)
    async makeUserAdminByIds(
        @Body('userIds') userIds: string[],
        @Res() res: Response,
        @Headers('authorization') authHeader: string
    ) {
        try {
            const token = this.jwtService.decode(authHeader?.split(' ')[1]);
            const user = await this.userService.findById(token?.id);

            if (!user?.isAdmin) throw new ForbiddenException('Not allowed');

            await this.userService.changeRoleByIds(userIds, true);
            res.status(HttpStatus.OK).send({ message: 'Success' });
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).send(error);
        }
    }

    @Put('user')
    @UseGuards(JwtAuthGuard)
    async makeUserUserByIds(
        @Body('userIds') userIds: string[],
        @Res() res: Response,
        @Headers('authorization') authHeader: string
    ) {
        try {
            const token = this.jwtService.decode(authHeader?.split(' ')[1]);
            const user = await this.userService.findById(token?.id);

            if (!user?.isAdmin) throw new ForbiddenException('Not allowed');

            await this.userService.changeRoleByIds(userIds, false);
            res.status(HttpStatus.OK).send({ message: 'Success' });
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).send(error);
        }
    }
}
