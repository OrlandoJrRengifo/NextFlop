import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { HttpModule } from "@nestjs/axios"

// Domain modules
import { MediaModule } from "./presentation/modules/media.module"
//import { SearchModule } from "./presentation/modules/search.module"

// Infrastructure
import { DatabaseModule } from "./infrastructure/database/database.module"
import { RabbitMQModule } from "./infrastructure/messaging/rabbitmq.module"

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),

    // HTTP client for external services
    HttpModule,

    // Database connection
    DatabaseModule,

    // Messaging
    RabbitMQModule,

    // Feature modules
    MediaModule,
    //SearchModule,
  ],
})
export class AppModule {}
