import { Injectable, Logger } from "@nestjs/common";
import axios from "axios";

import { CompleteOnboardingDto } from "../../../presentation/dtos/onboarding/complete-onboarding.dto";
import { OnboardingResponseDto } from "./onboarding-response.type";

import { AuthRegisterResponse } from "./types/auth-register-response.type";
import { SubscriptionResponse } from "./types/subscription-response.type";
import { PaymentResponse } from "./types/payment-response.type";

@Injectable()
export class OrchestrateOnboardingUseCase {
  private logger = new Logger(OrchestrateOnboardingUseCase.name);
  
  // URL base del servicio de Auth
  private authUrl = `${process.env.AUTH_SERVICE_URL}/register`;
  
  // Ahora esta variable apunta a la raíz (http://subscriptions-service:3000)
  private subscriptionServiceUrl = process.env.SUBSCRIPTIONS_SERVICE_URL;
  
  // Esta sigue apuntando directo al endpoint de pagos (http://billing-service:3000/payments)
  private paymentUrl = process.env.BILLING_SERVICE_URL;

  async execute(dto: CompleteOnboardingDto): Promise<OnboardingResponseDto> {
    this.logger.log(`Starting onboarding for user: ${dto.user.email} with plan: ${dto.planId}`);

    // 1. Crear Usuario
    const regResp = await axios.post<AuthRegisterResponse>(
      this.authUrl,
      dto.user,
    );
    const user = regResp.data.user;
    const token = regResp.data.accessToken;
    this.logger.log(`User created: ${user.id}`);

    // 2. Crear Suscripción
    // CORRECCIÓN: Agregamos "/subscriptions" a la URL base
    const subResp = await axios.post<SubscriptionResponse>(
      `${this.subscriptionServiceUrl}/subscriptions`, 
      { planId: dto.planId },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    const subscription = subResp.data;
    this.logger.log(`Subscription created: ${subscription.id} - Price: ${subscription.price}`);

    const amountToPay = subscription.price !== undefined ? subscription.price : 0;

    // 3. Procesar Pago
    const payResp = await axios.post<PaymentResponse>(
      this.paymentUrl!,
      {
        subscriptionId: subscription.id,
        originalAmount: amountToPay,
        pointsToRedeem: dto.payment.pointsToRedeem ?? 0,
        cardNumber: dto.payment.cardNumber,
        expiration: dto.payment.expiration,
        cvv: dto.payment.cvv,
        nameOnCard: dto.payment.nameOnCard,
      },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    
    const payment = payResp.data;
    this.logger.log(`Payment processed: ${payment.id}`);

    return {
      userId: user.id,
      subscriptionId: subscription.id,
      paymentId: payment.id,
      accessToken: token,
    };
  }
}