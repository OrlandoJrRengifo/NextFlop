import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MediaController } from "../controllers/media.controller";
import { Media, MediaSchema } from "../../infrastructure/database/schemas/media.schema";
import { MediaRepository } from "../../infrastructure/repositories/media.repository";
import { RabbitMQModule } from "../../infrastructure/messaging/rabbitmq.module";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";

// Use-cases
import { CreateMediaUseCase } from "../../application/use-cases/media/create-media.use-case";
import { UpdateMediaUseCase } from "../../application/use-cases/media/update-media.use-case";
import { DeleteMediaUseCase } from "../../application/use-cases/media/delete-media.use-case";
import { GetMediaUseCase } from "../../application/use-cases/media/get-media.use-case";
import { ListMediaUseCase } from "../../application/use-cases/media/list-media.usecase";
import { SearchMediaUseCase } from "../../application/use-cases/media/search-media.use-case";
import { IncrementViewCountUseCase } from "../../application/use-cases/media/increment-view.usecase";
import { UpdateRatingUseCase } from "../../application/use-cases/media/update-rating.usecase";
import { FindSimilarUseCase, FindRecommendedUseCase } from "../../application/use-cases/media/recommend-similar.usecase";

import { JwtStrategy } from "../guards/jwt.strategy";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Media.name, schema: MediaSchema }]),
    PassportModule,
    JwtModule.register({ secret: process.env.JWT_SECRET || "junior", signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || "24h" } }),
    RabbitMQModule,
  ],
  controllers: [MediaController],
  providers: [
    { provide: CreateMediaUseCase, useFactory: (repo) => new CreateMediaUseCase(repo), inject: ["IMediaRepository"] },
    { provide: UpdateMediaUseCase, useFactory: (repo) => new UpdateMediaUseCase(repo), inject: ["IMediaRepository"] },
    { provide: DeleteMediaUseCase, useFactory: (repo) => new DeleteMediaUseCase(repo), inject: ["IMediaRepository"] },
    { provide: GetMediaUseCase, useFactory: (repo) => new GetMediaUseCase(repo), inject: ["IMediaRepository"] },
    { provide: ListMediaUseCase, useFactory: (repo) => new ListMediaUseCase(repo), inject: ["IMediaRepository"] },
    { provide: SearchMediaUseCase, useFactory: (repo) => new SearchMediaUseCase(repo), inject: ["IMediaRepository"] },
    { provide: IncrementViewCountUseCase, useFactory: (repo) => new IncrementViewCountUseCase(repo), inject: ["IMediaRepository"] },
    { provide: UpdateRatingUseCase, useFactory: (repo) => new UpdateRatingUseCase(repo), inject: ["IMediaRepository"] },
    { provide: FindSimilarUseCase, useFactory: (repo) => new FindSimilarUseCase(repo), inject: ["IMediaRepository"] },
    { provide: FindRecommendedUseCase, useFactory: (repo) => new FindRecommendedUseCase(repo), inject: ["IMediaRepository"] },
    {
      provide: "IMediaRepository",
      useClass: MediaRepository,
    },
    JwtStrategy,
    JwtAuthGuard,
  ],

  exports: ["IMediaRepository"],
})
export class MediaModule { }
