import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || "mongodb://mongodb-billing:27017/nextflop_billing"),
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || "your_jwt_secret_key",
      signOptions: { expiresIn: "24h" },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}