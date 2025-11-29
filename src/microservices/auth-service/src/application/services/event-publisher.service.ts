import { Injectable } from "@nestjs/common";

@Injectable()
export class EventPublisher {
  async publishPointsUpdated(event: {
    userId: string;
    previousPoints: number;
    currentPoints: number;
    change: number;
    reason: string;
    timestamp: Date;
  }): Promise<void> {
    console.log("📤 Event published: loyalty.pointsUpdated", event);
    // TODO: Implement event publishing when message broker is available
  }

  async publishUserRegistered(event: {
    userId: string;
    email: string;
    fullName: string;
    timestamp: Date;
  }): Promise<void> {
    console.log("📤 Event published: user.registered", event);
    // TODO: Implement event publishing when message broker is available
  }

  async publishUserDeactivated(event: {
    userId: string;
    email: string;
    deactivatedAt: Date;
  }): Promise<void> {
    console.log("📤 Event published: user.deactivated", event);
    // TODO: Implement event publishing when message broker is available
  }
}