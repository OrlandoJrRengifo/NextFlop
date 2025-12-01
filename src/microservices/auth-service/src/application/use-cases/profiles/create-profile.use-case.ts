import { Inject, Injectable, BadRequestException, Logger } from "@nestjs/common";
import { IProfileRepository, PROFILE_REPOSITORY } from "../../../domain/repositories/profile.repository.interface";
import { Profile } from "../../../domain/entities/profile.entity";
import { v4 as uuidv4 } from "uuid";
import { CreateProfileDto } from "../../../presentation/dtos/profile/create-profile.dto";
import axios from "axios";

// 1. Definimos las interfaces para que TypeScript no se queje [cite: 5]
interface ActiveSubscriptionResponse {
  planId: string;
  userId: string;
  status: string;
}

interface PlanDetailsResponse {
  id: string;
  name: string;
  maxProfiles: number;
  price: number;
}

@Injectable()
export class CreateProfileUseCase {
  private readonly logger = new Logger(CreateProfileUseCase.name);
  private subscriptionServiceUrl = process.env.SUBSCRIPTIONS_SERVICE_URL || 'http://subscriptions-service:3000';

  constructor(
    @Inject(PROFILE_REPOSITORY) 
    private readonly profileRepository: IProfileRepository,
  ) {}

  async execute(data: CreateProfileDto, token: string): Promise<Profile> {
    const currentProfiles = await this.profileRepository.findByUserId(data.userId);
    
    try {
      const subUrl = `${this.subscriptionServiceUrl}/subscriptions/active`;
      
      // 2. Usamos el "Genérico" <ActiveSubscriptionResponse> en axios.get
      const subResponse = await axios.get<ActiveSubscriptionResponse>(subUrl, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (subResponse.data && subResponse.data.planId) {
        const planId = subResponse.data.planId;

        const planUrl = `${this.subscriptionServiceUrl}/plans/${planId}`;
        
        // 3. Usamos el "Genérico" <PlanDetailsResponse> aquí también
        const planResponse = await axios.get<PlanDetailsResponse>(planUrl); 

        // Ahora TypeScript sabe que .maxProfiles y .name existen
        const maxProfiles = planResponse.data.maxProfiles || 1;
        const planName = planResponse.data.name;

        if (currentProfiles.length >= maxProfiles) {
          throw new BadRequestException(
            `Tu plan actual (${planName}) solo permite ${maxProfiles} perfil(es).`
          );
        }
      } else {
        // Validación fallback si no hay suscripción activa
        if (currentProfiles.length >= 1) {
             throw new BadRequestException("Necesitas una suscripción activa para crear más perfiles.");
        }
      }

    } catch (error: any) {
      if (error instanceof BadRequestException) throw error;
      
      this.logger.error(`Error verificando plan: ${error.message}`);
      
      if (currentProfiles.length >= 1) {
          throw new BadRequestException("No se pudo verificar tu plan. Intenta nuevamente.");
      }
    }

    const now = new Date();
    const profile = new Profile(
      uuidv4(),
      data.userId,
      data.name,
      data.iconUrl || "👨",
      [], [], [], [],
      now,
      now,
    );

    return this.profileRepository.create(profile);
  }
}