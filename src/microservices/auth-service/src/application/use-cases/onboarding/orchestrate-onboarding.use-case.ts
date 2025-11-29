import { Injectable } from "@nestjs/common";
import axios from "axios";

import { CompleteOnboardingDto } from "../../../presentation/dtos/onboarding/complete-onboarding.dto";
import { OnboardingResponseDto } from "./onboarding-response.type";

import { AuthRegisterResponse } from "./types/auth-register-response.type";
import { SubscriptionResponse } from "./types/subscription-response.type";
import { PaymentResponse } from "./types/payment-response.type";

@Injectable()
export class OrchestrateOnboardingUseCase {
  private authUrl = `${process.env.AUTH_SERVICE_URL}/register`;
  private subscriptionUrl = process.env.SUBSCRIPTIONS_SERVICE_URL;
  private paymentUrl = process.env.BILLING_SERVICE_URL;

  async execute(dto: CompleteOnboardingDto): Promise<OnboardingResponseDto> {

    // --- 1. Registrar usuario ---
    const regResp = await axios.post<AuthRegisterResponse>(
      this.authUrl,
      dto.user,
    );

    const user = regResp.data.user;
    const token = regResp.data.accessToken;

    // --- 2. Crear suscripción ---
    const subResp = await axios.post<SubscriptionResponse>(
      this.subscriptionUrl,
      { planId: dto.planId },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    const subscription = subResp.data;

    // --- 3. Procesar pago ---
    const payResp = await axios.post<PaymentResponse>(
      this.paymentUrl,
      {
        subscriptionId: subscription.id,
        originalAmount: subscription.price,
        pointsToRedeem: dto.payment.pointsToRedeem ?? 0,

        cardNumber: dto.payment.cardNumber,
        expiration: dto.payment.expiration,
        cvv: dto.payment.cvv,
        nameOnCard: dto.payment.nameOnCard,
      },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    const payment = payResp.data;

    return {
      userId: user.id,
      subscriptionId: subscription.id,
      paymentId: payment.id,
      accessToken: token,
    };
  }
}
