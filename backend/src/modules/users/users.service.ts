import { Injectable } from '@nestjs/common';
import { User } from '@shared/user';

@Injectable()
export class UsersService {
  users: User[] = [];

  findOne(userId: string) {
    return Promise.resolve(this.users.find((user) => user.userId === userId));
  }
  create(user: User) {
    this.users.push(user);
    return Promise.resolve(user);
  }
}
