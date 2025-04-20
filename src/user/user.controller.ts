import { Body, Controller, Delete, Get, Param, Put, UseGuards, Res, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { UserGuard } from "./user.guard";
import { UpdateUserDto, UpdateImageDto } from "./user.dto";
import { Response } from "express";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get(':id')
    @UseGuards(JwtAuthGuard, UserGuard)
    async getById(@Param('id') id: string, @Res() res: Response) {
        try {
            const user = await this.userService.findById(id);
            res.status(HttpStatus.OK).send(user);
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).send(error);
        }
    }

    @Put('upload/:id')
    @UseGuards(JwtAuthGuard, UserGuard)
    async uploadImage(@Param('id') id: string, @Body() { url }: UpdateImageDto, @Res() res: Response) {
        try {
            const message = await this.userService.uploadImage(url, id);
            res.status(HttpStatus.OK).send({ message });
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).send(error);
        }
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, UserGuard)
    async updateById(@Param('id') id: string, @Body() { firstname, lastname }: UpdateUserDto, @Res() res: Response) {
        try {
            const message = await this.userService.updateById(id, firstname, lastname);
            res.status(HttpStatus.OK).send({ message });
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).send(error);
        }
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, UserGuard)
    async deleteById(@Param('id') id: string, @Res() res: Response) {
        try {
            const message = await this.userService.deleteById(id);
            res.status(HttpStatus.OK).send({ message });
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).send(error);
        }
    }
}
