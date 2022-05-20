import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ConfigModule } from "@ng-india/config";
import { SequelizeModule } from "@nestjs/sequelize";

import { CacheModule } from "@ng-india/cache";
import { Client } from "@ng-india/models";

import { LandlordService } from "./landlord.service";

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        return {
          dialect: "postgres",
          name: "landlord",
          host: config.get("dbHost") || "127.0.0.1",
          port: config.get("dbPort") || 5432,
          username: config.get("dbUser") || "postgres",
          password: config.get("dbPassword") || "",
          database: config.get("dbName") || "autoload.ai",
          autoLoadModels: true,
          models: [Client],
        };
      },
      inject: [ConfigService],
    }),
    SequelizeModule.forFeature([Client]),
    CacheModule,
  ],
  providers: [LandlordService],
  exports: [LandlordService],
})
export class LandlordModule {}
