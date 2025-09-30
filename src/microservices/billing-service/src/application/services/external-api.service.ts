import { Injectable } from "@nestjs/common"
import { HttpService } from "@nestjs/axios"
import { firstValueFrom } from "rxjs"

/**
 * External API Service
 * Handles communication with other microservices
 * Following Clean Architecture - Application layer
 */
@Injectable()
export class ExternalApiService {
  constructor(private readonly httpService: HttpService) {}

  async getUserPointsBalance(userId: string): Promise<number> {
    try {
      const authServiceUrl = process.env.AUTH_SERVICE_URL || "http://localhost:3001"
      const response = await firstValueFrom(
        this.httpService.get(`${authServiceUrl}/users/${userId}/points-balance`, {
          headers: {
            "Content-Type": "application/json",
          },
        }),
      )

      return response.data.pointsBalance || 0
    } catch (error) {
      console.error("Failed to get user points balance:", error)
      return 0
    }
  }

  async updateUserPoints(userId: string, pointsChange: number, reason: string): Promise<void> {
    try {
      const authServiceUrl = process.env.AUTH_SERVICE_URL || "http://localhost:3001"
      await firstValueFrom(
        this.httpService.put(
          `${authServiceUrl}/users/${userId}/points`,
          {
            pointsChange,
            reason,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        ),
      )
    } catch (error) {
      console.error("Failed to update user points:", error)
      throw error
    }
  }

  async getSubscriptionDetails(subscriptionId: string): Promise<any> {
    try {
      const subscriptionsServiceUrl = process.env.SUBSCRIPTIONS_SERVICE_URL || "http://localhost:3002"
      const response = await firstValueFrom(
        this.httpService.get(`${subscriptionsServiceUrl}/subscriptions/${subscriptionId}`, {
          headers: {
            "Content-Type": "application/json",
          },
        }),
      )

      return response.data
    } catch (error) {
      console.error("Failed to get subscription details:", error)
      throw error
    }
  }

  async activateSubscription(subscriptionId: string): Promise<void> {
    try {
      const subscriptionsServiceUrl = process.env.SUBSCRIPTIONS_SERVICE_URL || "http://localhost:3002"
      await firstValueFrom(
        this.httpService.put(
          `${subscriptionsServiceUrl}/subscriptions/${subscriptionId}/activate`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        ),
      )
    } catch (error) {
      console.error("Failed to activate subscription:", error)
      throw error
    }
  }
}
