import { Injectable } from "@nestjs/common"
import Stripe from "stripe"

/**
 * Stripe Service
 * Handles Stripe payment processing
 * Infrastructure layer - External service adapter
 */
@Injectable()
export class StripeService {
  private stripe: Stripe

  constructor() {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    if (!stripeSecretKey) {
      throw new Error("STRIPE_SECRET_KEY environment variable is required")
    }

    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    })
  }

  async createPaymentIntent(params: {
    amount: number
    currency: string
    paymentMethod: string
    confirmationMethod: string
    confirm: boolean
    metadata?: Record<string, string>
  }): Promise<Stripe.PaymentIntent> {
    return await this.stripe.paymentIntents.create({
      amount: params.amount,
      currency: params.currency,
      payment_method: params.paymentMethod,
      confirmation_method: params.confirmationMethod as any,
      confirm: params.confirm,
      metadata: params.metadata,
    })
  }

  async confirmPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    return await this.stripe.paymentIntents.confirm(paymentIntentId)
  }

  async retrievePaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    return await this.stripe.paymentIntents.retrieve(paymentIntentId)
  }

  async createRefund(params: { paymentIntent: string; amount?: number; reason?: string }): Promise<Stripe.Refund> {
    return await this.stripe.refunds.create({
      payment_intent: params.paymentIntent,
      amount: params.amount,
      reason: params.reason as any,
    })
  }

  async createCustomer(params: {
    email: string
    name?: string
    metadata?: Record<string, string>
  }): Promise<Stripe.Customer> {
    return await this.stripe.customers.create({
      email: params.email,
      name: params.name,
      metadata: params.metadata,
    })
  }

  async createPaymentMethod(params: {
    type: string
    card?: {
      number: string
      exp_month: number
      exp_year: number
      cvc: string
    }
  }): Promise<Stripe.PaymentMethod> {
    return await this.stripe.paymentMethods.create({
      type: params.type as any,
      card: params.card,
    })
  }

  async attachPaymentMethodToCustomer(paymentMethodId: string, customerId: string): Promise<Stripe.PaymentMethod> {
    return await this.stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    })
  }

  async constructWebhookEvent(payload: string | Buffer, signature: string): Promise<Stripe.Event> {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (!webhookSecret) {
      throw new Error("STRIPE_WEBHOOK_SECRET environment variable is required")
    }

    return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret)
  }
}
