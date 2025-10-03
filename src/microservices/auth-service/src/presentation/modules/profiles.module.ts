import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ProfilesController } from "../controllers/profiles.controller";
import { CreateProfileUseCase } from "../../application/use-cases/profiles/create-profile.use-case";
import { GetProfileUseCase } from "../../application/use-cases/profiles/get-profile.use-case";
import { UpdateProfileUseCase } from "../../application/use-cases/profiles/update-profile.use-case";
import { AddToListUseCase } from "../../application/use-cases/profiles/add-to-list.use-case";
import { RemoveFromListUseCase } from "../../application/use-cases/profiles/remove-from-list.use-case";
import { ProfileRepository } from "../../infrastructure/repositories/profile.repository";
import { DeleteProfileUseCase } from "../../application/use-cases/profiles/delete-profile.use-case";

// Se importa 'ProfileDocument' que es el nombre correcto de la clase
import { ProfileDocument, ProfileSchema } from "../../infrastructure/database/schemas/profile.schema";
import { RabbitMQModule } from "../../infrastructure/messaging/rabbitmq.module";
import { PROFILE_REPOSITORY } from "../../domain/repositories/profile.repository.interface";

@Module({
  imports: [
    // Se usa ProfileDocument.name, que es el nombre correcto
    MongooseModule.forFeature([{ name: ProfileDocument.name, schema: ProfileSchema }]),
    RabbitMQModule,
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