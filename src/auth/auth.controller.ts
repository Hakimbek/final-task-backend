import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDTO, LoginDTO } from "./auth.dto";
import { Response } from 'express';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() { email, password }: LoginDTO, @Res() res: Response) {
    try {
      const result = await this.authService.login(email, password);
      res.status(HttpStatus.OK).send(result);
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).send(error);
    }
  }

  @Post('signup')
  async signup(@Body() { email, firstname, lastname, password }: SignUpDTO, @Res() res: Response) {
    try {
      const message = await this.authService.signup(email, firstname, lastname, password);
      res.status(HttpStatus.OK).send({ message });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).send(error);
    }
  }
}
