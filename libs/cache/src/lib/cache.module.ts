import { ConfigService } from "@nestjs/config";
import { ConfigModule } from "@ng-india/config";
import { Module, CacheModule as CoreCacheModule } from "@nestjs/common";
import * as redisStore from "cache-manager-redis-store";

@Module({
  imports: [
    CoreCacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        return {
          store: redisStore,
          host: config.get("redisHost"),
          port: config.get("redisPort"),
          db: 0,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class CacheModule {}
