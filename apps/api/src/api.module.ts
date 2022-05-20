import { HttpException, Module } from "@nestjs/common";
import { APP_GUARD, REQUEST } from "@nestjs/core";
import { Request } from "express";
import { TenancyModule } from "nestjs-tenancy";

import { JwtGuard, JwtModule } from "@ng-india/jwt";
import { LandlordModule, LandlordService } from "@ng-india/landlord";
import { Client } from "@ng-india/models";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    TenancyModule.forRootAsync({
      imports: [LandlordModule],
      useFactory: async (request: Request, landlord: LandlordService) => {
        const tenant: Client | null = await landlord.getClient(
          request.headers["workspace"] as string
        );

        if (!tenant) {
          throw new HttpException("Invalid workspace.", 400);
        }

        return {
          tenantId: tenant.workspace,
          uri: () =>
            `postgresql://${tenant.dbUser}:${tenant.dbPassword}@${tenant.dbHost}:${tenant.dbPort}/${tenant.dbName}?schema=public`,
        };
      },
      inject: [REQUEST, LandlordService],
    }),
    JwtModule,
    UserModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class ApiModule {}
