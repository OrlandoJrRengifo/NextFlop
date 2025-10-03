import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

// Controllers
import { UsersController } from "../controllers/users.controller";
import { AuthController } from "../controllers/auth.controller";

// Use Cases
import { LoginUseCase } from "../../application/use-cases/auth/login.use-case";
import { RegisterUseCase } from "../../application/use-cases/auth/register.use-case";
import { GetUserUseCase } from "../../application/use-cases/users/get-user.use-case";
import { UpdateUserUseCase } from "../../application/use-cases/users/update-user.use-case";
import { AddPointsUseCase } from "../../application/use-cases/users/add-points.use-case";
import { DeleteUserUseCase } from "../../application/use-cases/users/delete-user.use-case";

// Infraestructura
import { UserRepository } from "../../infrastructure/repositories/user.repository";
import { UserDocument, UserSchema } from "../../infrastructure/database/schemas/user.schema";
import { RabbitMQModule } from "../../infrastructure/messaging/rabbitmq.module";

// Dominio
import { USER_REPOSITORY } from "../../domain/repositories/user.repository.interface";

// Servicios de aplicación
import { UserFactory } from "../../application/factories/user.factory";
import { EventPublisher } from "../../application/services/event-publisher.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserDocument.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: configService.get<string>("JWT_EXPIRES_IN") },
      }),
      inject: [ConfigService],
    }),
    RabbitMQModule,
  ],
  controllers: [UsersController, AuthController],
  providers: [
    LoginUseCase,
    RegisterUseCase,
    GetUserUseCase,
    UpdateUserUseCase,
    AddPointsUseCase,
    DeleteUserUseCase,
    UserFactory,
    EventPublisher,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
  exports: [
    LoginUseCase,
    RegisterUseCase,
    GetUserUseCase,
    UpdateUserUseCase,
    AddPointsUseCase,
    DeleteUserUseCase,
    USER_REPOSITORY,
  ],
})
export class UsersModule {}
