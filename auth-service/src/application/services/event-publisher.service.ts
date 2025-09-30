import { Injectable } from "@nestjs/common";
import { RabbitMQService } from "../../infrastructure/messaging/rabbitmq.service";

@Injectable()
export class EventPublisher {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  async publishPointsUpdated(event: {
    userId: string;
    previousPoints: number; // Renombrado
    currentPoints: number;  // Renombrado
    change: number;
    reason: string;
    timestamp: Date;
  }): Promise<void> {
    await this.rabbitMQService.publish("loyalty.pointsUpdated", event);
  }

  async publishUserRegistered(event: {
    userId: string;
    email: string;
    fullName: string; // Se usa fullName
    timestamp: Date;
  }): Promise<void> {
    await this.rabbitMQService.publish("user.registered", event);
  }

  async publishUserDeactivated(event: {
    userId: string;
    email: string;
    timestamp: Date;
  }): Promise<void> {
    await this.rabbitMQService.publish("user.deactivated", event);
  }
}