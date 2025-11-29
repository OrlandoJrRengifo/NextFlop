import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { SubscriptionsController } from "../controllers/subscriptions.controller";
import { SubscriptionsService } from "../../application/services/subscriptions.service";
import { Subscription, SubscriptionSchema } from "../../domain/schemas/subscription.schema";
import { JwtStrategy } from "../../auth/jwt.strategy";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Subscription.name, schema: SubscriptionSchema }]),
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET") || "your_jwt_secret_key",
        signOptions: { expiresIn: "24h" },
      }),
    }),
  ],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService, JwtStrategy, JwtAuthGuard],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}