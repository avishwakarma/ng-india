import { JwtGuard } from "@ng-india/jwt";
import { Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { AuthService } from "./auth.service";

@Controller()
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post("register")
  async register(@Req() req: Request) {
    return this.auth.register(req.body, {
      ua: req.headers["user-agent"],
      ip: req.socket.remoteAddress,
    });
  }

  @Post("login")
  async login(@Req() req: Request) {
    return this.auth.login(req.body, {
      ua: req.headers["user-agent"],
      ip: req.socket.remoteAddress,
    });
  }

  @Post("login-via-token")
  async loginViaToken(@Req() req: Request) {
    return this.auth.loginViaToken(req.body.token);
  }

  @Get("check-workspace/:workspace")
  async checkWorkspace(@Param("workspace") workspace: string) {
    return this.auth.checkWorkspace(workspace);
  }

  @UseGuards(JwtGuard)
  @Get("refresh-token")
  async refreshToken(@Req() req: Request) {
    return this.auth.refreshToken(req["user"], {
      ua: req.headers["user-agent"],
      ip: req.socket.remoteAddress,
    });
  }
}
