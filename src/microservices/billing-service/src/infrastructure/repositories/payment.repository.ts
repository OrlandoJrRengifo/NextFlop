// src/infrastructure/repositories/payment.repository.ts

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IPaymentRepository } from "../../domain/repositories/payment.repository.interface";
import { Payment, PaymentStatus } from "../../domain/entities/payment.entity";
import { PaymentDocument } from "../database/schemas/payment.schema";

@Injectable()
export class PaymentRepository implements IPaymentRepository {
  constructor(
    @InjectModel(PaymentDocument.name)
    private paymentModel: Model<PaymentDocument>
  ) {}

  async findById(id: string): Promise<Payment | null> {
    const doc = await this.paymentModel.findById(id).exec();
    return doc ? this.toDomain(doc) : null;
  }

  async findByUserId(userId: string): Promise<Payment[]> {
    const docs = await this.paymentModel.find({ userId }).sort({ createdAt: -1 }).exec();
    return docs.map(this.toDomain);
  }

  async findBySubscriptionId(subscriptionId: string): Promise<Payment[]> {
    const docs = await this.paymentModel.find({ subscriptionId }).sort({ createdAt: -1 }).exec();
    return docs.map(this.toDomain);
  }

  async findByStatus(status: PaymentStatus): Promise<Payment[]> {
    const docs = await this.paymentModel.find({ status }).exec();
    return docs.map(this.toDomain);
  }

  async create(payment: Payment): Promise<Payment> {
    const payload: any = {
      _id: payment.id,
      userId: payment.userId,
      subscriptionId: payment.subscriptionId,
      originalAmount: payment.originalAmount,
      finalAmount: payment.finalAmount,
      pointsRedeemed: payment.pointsRedeemed,
      pointsGained: payment.pointsGained,
      status: payment.status,
      failureDetails: payment.failureDetails ?? null,
      createdAt: payment.createdAt ?? new Date(),
      updatedAt: payment.updatedAt ?? new Date(),
    };
    const saved = await new this.paymentModel(payload).save();
    return this.toDomain(saved);
  }

  async update(id: string, paymentData: Partial<Payment>): Promise<Payment | null> {
    const doc = await this.paymentModel.findByIdAndUpdate(id, paymentData, { new: true }).exec();
    return doc ? this.toDomain(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.paymentModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  async findAll(limit = 10, offset = 0): Promise<Payment[]> {
    const docs = await this.paymentModel.find().skip(offset).limit(limit).sort({ createdAt: -1 }).exec();
    return docs.map(this.toDomain);
  }

  private toDomain = (doc: PaymentDocument): Payment => {
    return new Payment(
      doc._id.toString(),
      doc.userId,
      doc.subscriptionId,
      doc.originalAmount,
      doc.finalAmount,
      doc.pointsRedeemed,
      doc.pointsGained,
      doc.status as unknown as PaymentStatus,
      doc.failureDetails,
      doc.createdAt,
      doc.updatedAt
    );
  };
}
