/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from "@nestjs/core";
import { loadConfig } from "@ng-india/utils";

import { ApiModule } from "./api.module";

async function bootstrap() {
  loadConfig();

  const app = await NestFactory.create(ApiModule, {
    cors: {
      origin: "*",
      exposedHeaders: ["Authorization"],
    },
  });

  await app.listen(
    process.env.API_PORT || 4000,
    process.env.API_HOST || "0.0.0.0"
  );

  console.log(
    `API Server is running at http://localhost:${process.env.API_PORT}`
  );
}

bootstrap();
