import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  validateUser = async (email: string, password: string) => {
    const user = await this.userService.findByEmail(email);
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) throw new UnauthorizedException('Passwords or email is wrong  ');

    return user;
  }

  login = async (email: string, password: string) => {
    const user = await this.validateUser(email, password);

    if (!user.isActive) throw new UnauthorizedException('User is disabled');

    return { token: this.jwtService.sign({ id: user.id }), id: user.id };
  }

  signup = async (email: string, firstname: string, lastname: string, password: string) => {
    await this.userService.create(email, firstname, lastname, password);

    return 'User successfully created. Please login';
  }
}
