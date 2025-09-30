import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport"
import { ConfigModule } from "@nestjs/config"

// Domain modules
import { UsersModule } from "./presentation/modules/users.module"
import { AuthModule } from "./presentation/modules/auth.module"
import { ProfilesModule } from "./presentation/modules/profiles.module"

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

    // Database connection
    DatabaseModule,

    // Messaging
    RabbitMQModule,

    // JWT configuration
    JwtModule.register({
      secret: process.env.JWT_SECRET || "your-super-secret-jwt-key",
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || "24h" },
    }),

    // Passport
    PassportModule,

    // Feature modules
    AuthModule,
    UsersModule,
    ProfilesModule,
  ],
})
export class AppModule {}
