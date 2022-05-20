/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from "@nestjs/core";

import { AuthModule } from "./auth.module";

async function bootstrap() {
  const app = await NestFactory.create(AuthModule, {
    cors: {
      origin: "*",
      exposedHeaders: ["Authorization"],
    },
  });

  await app.listen(
    process.env.AUTH_PORT || 5000,
    process.env.AUTH_HOST || "0.0.0.0"
  );

  console.log(
    `Auth Server is running at http://localhost:${process.env.AUTH_PORT}`
  );
}

bootstrap();
