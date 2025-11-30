import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IPaymentRepository } from "../../domain/repositories/payment.repository.interface";
import { Payment, PaymentStatus } from "../../domain/entities/payment.entity";
import { PaymentDocument } from "../database/schemas/payment.schema";

@Injectable()
export class PaymentRepository implements IPaymentRepository {
  private readonly logger = new Logger(PaymentRepository.name);

  constructor(
    @InjectModel(PaymentDocument.name)
    private readonly paymentModel: Model<PaymentDocument>,
  ) {}

  async findById(id: string): Promise<Payment | null> {
    const doc = await this.paymentModel.findById(id).exec();
    return this.safeToDomain(doc);
  }

  async findByUserId(userId: string): Promise<Payment[]> {
    const docs = await this.paymentModel.find({ userId }).sort({ createdAt: -1 }).exec();
    return docs.map((d) => this.safeToDomain(d)).filter((p): p is Payment => p !== null);
  }

  async findBySubscriptionId(subscriptionId: string): Promise<Payment[]> {
    const docs = await this.paymentModel.find({ subscriptionId }).exec();
    return docs.map((d) => this.safeToDomain(d)).filter((p): p is Payment => p !== null);
  }

  async findByStatus(status: PaymentStatus): Promise<Payment[]> {
    const docs = await this.paymentModel.find({ status }).exec();
    return docs.map((d) => this.safeToDomain(d)).filter((p): p is Payment => p !== null);
  }

  async create(payment: Payment): Promise<Payment> {
    const payload = {
      _id: payment.id, // ID Explícito (UUID)
      userId: payment.userId,
      subscriptionId: payment.subscriptionId,
      originalAmount: payment.originalAmount,
      finalAmount: payment.finalAmount,
      pointsRedeemed: payment.pointsRedeemed,
      pointsGained: payment.pointsGained,
      status: payment.status,
      failureDetails: payment.failureDetails,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
      cardLast4: payment.cardLast4,
      cardBrand: payment.cardBrand,
      expiration: payment.expiration,
      nameOnCard: payment.nameOnCard,
    };

    const saved = await new this.paymentModel(payload).save();
    return this.safeToDomain(saved)!;
  }

  async update(id: string, data: Partial<Payment>): Promise<Payment | null> {
    const doc = await this.paymentModel.findByIdAndUpdate(id, data, { new: true }).exec();
    return this.safeToDomain(doc);
  }

  async delete(id: string): Promise<boolean> {
    const res = await this.paymentModel.findByIdAndDelete(id).exec();
    return !!res;
  }

  async findAll(limit = 20, offset = 0): Promise<Payment[]> {
    const docs = await this.paymentModel
      .find()
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();
    return docs.map((d) => this.safeToDomain(d)).filter((p): p is Payment => p !== null);
  }

  private safeToDomain(doc: PaymentDocument | null): Payment | null {
    if (!doc) return null;
    try {
      return new Payment(
        doc._id.toString(),
        doc.userId,
        doc.subscriptionId,
        doc.originalAmount,
        doc.finalAmount,
        doc.pointsRedeemed,
        doc.pointsGained,
        doc.status,
        doc.failureDetails,
        doc.createdAt,
        doc.updatedAt,
        doc.cardLast4,
        doc.cardBrand,
        doc.expiration,
        doc.nameOnCard,
      );
    } catch (e) {
      this.logger.error(`Error mapping payment ${doc._id}: ${e}`);
      return null;
    }
  }

  private toDomain(doc: PaymentDocument): Payment {
    return this.safeToDomain(doc) as Payment;
  }
}