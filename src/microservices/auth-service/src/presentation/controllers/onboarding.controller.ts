import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { CompleteOnboardingDto } from "../dtos/onboarding/complete-onboarding.dto";
import { OrchestrateOnboardingUseCase } from "../../application/use-cases/onboarding/orchestrate-onboarding.use-case";
import { OnboardingResponseDto } from "../dtos/onboarding/onboarding-response.dto";

@ApiTags("Onboarding")
@Controller("onboarding")
export class OnboardingController {
  constructor(private readonly orchestrator: OrchestrateOnboardingUseCase) {}

  @Post("complete")
  @ApiOperation({ summary: "Completar registro completo del usuario" })
  @ApiResponse({ status: 201, type: OnboardingResponseDto })
  async complete(@Body() dto: CompleteOnboardingDto): Promise<OnboardingResponseDto> {
    return this.orchestrator.execute(dto);
  }
}
