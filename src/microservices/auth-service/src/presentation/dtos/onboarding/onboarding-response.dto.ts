import { ApiProperty } from "@nestjs/swagger";

export class OnboardingResponseDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  subscriptionId: string;

  @ApiProperty()
  paymentId: string;

  @ApiProperty()
  accessToken: string;
}
