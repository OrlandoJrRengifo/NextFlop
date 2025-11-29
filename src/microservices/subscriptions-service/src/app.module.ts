import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { SubscriptionsModule } from "./presentation/modules/subscriptions.module";
import { PlansModule } from "./presentation/modules/plans.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || "mongodb://mongodb-subscriptions:27017/nextflop-subscriptions"),
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || "your_jwt_secret_key",
      signOptions: { expiresIn: "24h" },
    }),
    SubscriptionsModule,
    PlansModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
