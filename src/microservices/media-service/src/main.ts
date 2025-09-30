import { NestFactory } from "@nestjs/core"
import { ValidationPipe } from "@nestjs/common"
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger"
import { AppModule } from "./app.module"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // CORS configuration
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:3004"],
    credentials: true,
  })

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )

  // Swagger documentation setup
  const config = new DocumentBuilder()
    .setTitle("Nextflop Media Service")
    .setDescription("Media Catalog and Content Management API for Nextflop platform")
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        description: "Enter JWT token",
        in: "header",
      },
      "JWT-auth",
    )
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("api/docs", app, document)

  const port = process.env.PORT || 3004
  await app.listen(port)

  console.log(`🚀 Media Service running on port ${port}`)
  console.log(`📚 Swagger docs available at http://localhost:${port}/api/docs`)
}

bootstrap()
