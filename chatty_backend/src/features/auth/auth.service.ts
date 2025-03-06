import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/features/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  public async validateUser(username: string, password: string) {
    const user = await this.usersService.findUserByUsername({username});
    if (!user) return null;

    const pass = await bcrypt.compare(password, user.password);
    if (!pass) return null;

    return user;
  }
}
