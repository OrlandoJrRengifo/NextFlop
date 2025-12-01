import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport"; // <--- FALTABA
import { JwtModule } from "@nestjs/jwt";           // <--- FALTABA
import { ConfigModule, ConfigService } from "@nestjs/config";

import { ProfilesController } from "../controllers/profiles.controller";
import { CreateProfileUseCase } from "../../application/use-cases/profiles/create-profile.use-case";
import { GetProfileUseCase } from "../../application/use-cases/profiles/get-profile.use-case";
import { UpdateProfileUseCase } from "../../application/use-cases/profiles/update-profile.use-case";
import { AddToListUseCase } from "../../application/use-cases/profiles/add-to-list.use-case";
import { RemoveFromListUseCase } from "../../application/use-cases/profiles/remove-from-list.use-case";
import { DeleteProfileUseCase } from "../../application/use-cases/profiles/delete-profile.use-case";
import { ProfileRepository } from "../../infrastructure/repositories/profile.repository";
import { ProfileDocument, ProfileSchema } from "../../infrastructure/database/schemas/profile.schema";
import { RabbitMQModule } from "../../infrastructure/messaging/rabbitmq.module";
import { PROFILE_REPOSITORY } from "../../domain/repositories/profile.repository.interface";
// Asegúrate de que la ruta sea correcta según tu estructura
import { JwtStrategy } from "../guards/jwt.strategy"; 

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ProfileDocument.name, schema: ProfileSchema }]),
    RabbitMQModule,
    // --- SEGURIDAD: Configuración JWT ---
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  controllers: [ProfilesController],
  providers: [
    CreateProfileUseCase,
    GetProfileUseCase,
    UpdateProfileUseCase,
    AddToListUseCase,
    RemoveFromListUseCase,
    DeleteProfileUseCase,
    {
      provide: PROFILE_REPOSITORY,
      useClass: ProfileRepository,
    },
    // --- SEGURIDAD: Proveedor de Estrategia ---
    JwtStrategy, // <--- INDISPENSABLE para que req.user exista
    {
      // Alias adicional por si algún componente lo inyecta por string
      provide: "IProfileRepository", 
      useClass: ProfileRepository 
    }
  ],
  exports: [
    CreateProfileUseCase,
    GetProfileUseCase,
    UpdateProfileUseCase,
    AddToListUseCase,
    RemoveFromListUseCase,
    PROFILE_REPOSITORY,
  ],
})
export class ProfilesModule {}