import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import * as amqp from "amqp-connection-manager";
import { ChannelWrapper } from "amqp-connection-manager";
import { ConfirmChannel } from "amqplib";

/**
 * RabbitMQ Service
 * Handles message publishing and consuming
 * Using amqp-connection-manager (auto-reconnect)
 */
@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection?: amqp.AmqpConnectionManager;
  private channelWrapper?: ChannelWrapper;

  async onModuleInit() {
    try {
      const rabbitmqUrl = process.env.RABBITMQ_URL || "amqp://localhost:5672";

      // Conexión con autoreconexión
      this.connection = amqp.connect([rabbitmqUrl]);

      // Crear canal con setup inicial
      this.channelWrapper = this.connection.createChannel({
        setup: async (channel: ConfirmChannel) => {
          await channel.assertExchange("nextflop.events", "topic", { durable: true });
        },
      });

      this.connection.on("connect", () =>
        console.log("✅ RabbitMQ connected successfully"),
      );
      this.connection.on("disconnect", (err) =>
        console.error("❌ RabbitMQ disconnected:", err?.err?.message),
      );
    } catch (error) {
      console.error("❌ Failed to initialize RabbitMQ:", error);
    }
  }

  async onModuleDestroy() {
    try {
      if (this.channelWrapper) {
        await this.channelWrapper.close();
        console.log("🔒 RabbitMQ channel closed");
      }
      if (this.connection) {
        await this.connection.close();
        console.log("🔌 RabbitMQ connection closed");
      }
    } catch (error) {
      console.error("⚠️ Error closing RabbitMQ resources:", error);
    }
  }

  async publish(routingKey: string, message: any): Promise<void> {
    if (!this.channelWrapper) {
      console.error("❌ RabbitMQ channel not available, cannot publish");
      return;
    }

    try {
      const messageBuffer = Buffer.from(JSON.stringify(message));
      await this.channelWrapper.publish("nextflop.events", routingKey, messageBuffer, {
        contentType: "application/json",
        timestamp: Date.now(),
      } as any);

      console.log(`📤 Published event: ${routingKey}`);
    } catch (error) {
      console.error(`❌ Error publishing event ${routingKey}:`, error);
    }
  }

  async subscribe(routingKey: string, callback: (message: any) => void): Promise<void> {
    if (!this.channelWrapper) {
      console.error("❌ RabbitMQ channel not available, cannot subscribe");
      return;
    }

    try {
      await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
        const queue = await channel.assertQueue("", { exclusive: true });
        await channel.bindQueue(queue.queue, "nextflop.events", routingKey);

        await channel.consume(queue.queue, (msg) => {
          if (msg) {
            try {
              const content = JSON.parse(msg.content.toString());
              callback(content);
              channel.ack(msg);
            } catch (err) {
              console.error("⚠️ Error processing message:", err);
              channel.nack(msg, false, false);
            }
          }
        });
      });

      console.log(`📥 Subscribed to: ${routingKey}`);
    } catch (error) {
      console.error(`❌ Failed to subscribe to ${routingKey}:`, error);
    }
  }
}
