import { Module } from "@nestjs/common";
import { User } from "@ng-india/models";
import { TenancyModule } from "nestjs-tenancy";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  imports: [TenancyModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
