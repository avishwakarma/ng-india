import { Module, Global } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule as JwtRootModule, JwtSecretRequestType } from "@nestjs/jwt";
import { readFileSync } from "fs";

@Global()
@Module({
  imports: [
    JwtRootModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        return {
          secretOrKeyProvider(type: JwtSecretRequestType) {
            switch (type) {
              case JwtSecretRequestType.SIGN:
                return readFileSync(config.get("jwtPrivateKey"), "utf8");

              case JwtSecretRequestType.VERIFY:
                return readFileSync(config.get("jwtPublicKey"), "utf8");
            }
          },
          signOptions: {
            expiresIn: config.get("jwtExpiry"),
            issuer: config.get("jwtIssuer"),
            algorithm: config.get("jwtAlgorithm"),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [JwtRootModule],
})
export class JwtModule {}
