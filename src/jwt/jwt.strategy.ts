import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from "../user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
      private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secretKey',
    });
  }

  /**
   * Checks user status and existence. If user is active they can go forward. If not they are not allowed.
   * The same scenario with user existence. If user with this id exists, we allow going forward.
   * @param id - user id.
   */
  async validate({ id }: { id: string }) {
    const user = await this.userService.findById(id);

    if (!user.isActive) throw new UnauthorizedException('User is deactivated');

    return id;
  }
}
