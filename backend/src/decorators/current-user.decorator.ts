import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@shared/user';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as User;

    if (!user) {
      return null;
    }

    if (typeof data === 'string' && data in user) {
      return user[data];
    }

    return user;
  },
);
