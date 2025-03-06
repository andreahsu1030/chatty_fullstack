import { CanActivate, ExecutionContext } from "@nestjs/common";

export class AuthGuards implements CanActivate{
  canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest()
    return req.session.userId
  }
}