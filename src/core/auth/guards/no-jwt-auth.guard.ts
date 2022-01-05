import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class NoJwtGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const auth = req.headers['Authroization']; // as there should not have any authorization headers, reject if the header exists
    return !auth;
  }
}
