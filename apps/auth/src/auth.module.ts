import { Module } from "@nestjs/common";

import { LandlordModule } from "@ng-india/landlord";
import { JwtModule } from "@ng-india/jwt";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  imports: [LandlordModule, JwtModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
