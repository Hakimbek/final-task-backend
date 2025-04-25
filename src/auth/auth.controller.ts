import { Controller, Post, Body, BadRequestException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignUpDTO, LoginDTO } from "./auth.dto";

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(@Body() { email, password }: LoginDTO) {
    try {
      return await this.authService.login(email, password);
    } catch (error) {
      throw new BadRequestException(error.response);
    }
  }

  @Post("signup")
  async signup(@Body() { email, firstname, lastname, password }: SignUpDTO) {
    try {
      return await this.authService.signup(email, firstname, lastname, password);
    } catch (error) {
      throw new BadRequestException(error.response);
    }
  }
}
