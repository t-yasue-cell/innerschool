// password.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class PasswordGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req: Request = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();

    if (req.cookies && req.cookies['kj_auth']) {
      // パスワードを打ったことがあれば通す
      return true;
    }

    throw new UnauthorizedException(); // 401 エラーを投げる
  }
}

export class PasswordGuardHard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req: Request = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();

    if (
      req.cookies &&
      req.cookies['kj_auth'] &&
      req.cookies['kj_auth'] === 'ok'
    ) {
      // パスワードを打ったことがあれば通す
      return true;
    }

    throw new UnauthorizedException(); // 401 エラーを投げる
  }
}
