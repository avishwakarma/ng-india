import { Controller, Get, Req } from "@nestjs/common";
import { Request } from "express";
import { UserService } from "./user.service";

@Controller("users")
export class UserController {
  constructor(private user: UserService) {}

  @Get("me")
  async me(@Req() req: Request) {
    console.log(req["user"]);
    return this.user.findByPk(req["user"].id);
  }
}
