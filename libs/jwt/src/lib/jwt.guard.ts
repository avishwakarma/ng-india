import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from "@nestjs/common";
import { HttpArgumentsHost } from "@nestjs/common/interfaces";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { Observable } from "rxjs";
import { ExtractJwt } from "passport-jwt";

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx: HttpArgumentsHost = context.switchToHttp();

    const req: Request = ctx.getRequest();

    const token: string = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

    if (!token) {
      throw new HttpException("Unauthorized.", 403);
    }

    try {
      const { user } = this.jwt.verify(token);

      if (!user) {
        throw new HttpException("Unauthorized.", 403);
      }

      req["user"] = user;
    } catch (error) {
      console.log(error);
      return false;
    }

    return true;
  }
}
