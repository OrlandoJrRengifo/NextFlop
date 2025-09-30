import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";

// Domain modules
import { PaymentsModule } from "./presentation/modules/payments.module";

// Infrastructure
import { DatabaseModule } from "./infrastructure/database/database.module";
import { RabbitMQModule } from "./infrastructure/messaging/rabbitmq.module";
import { StripeModule } from "./infrastructure/stripe/stripe.module";

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

    // Stripe integration
    StripeModule,

    // Feature modules
    PaymentsModule,
  ],
})
export class AppModule {}