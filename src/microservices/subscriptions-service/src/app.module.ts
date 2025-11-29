import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { SubscriptionsModule } from "./presentation/modules/subscriptions.module";
import { PlansModule } from "./presentation/modules/plans.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || "mongodb://mongodb-subscriptions:27017/nextflop-subscriptions"),
    PlansModule,
    SubscriptionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
