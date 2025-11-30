import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ISubscriptionRepository } from "../../domain/repositories/subscription.repository.interface";
import { Subscription, SubscriptionStatus } from "../../domain/entities/subscription.entity";
import { SubscriptionDocument } from "../database/schemas/subscription.schema";

@Injectable()
export class SubscriptionRepository implements ISubscriptionRepository {
  private readonly logger = new Logger(SubscriptionRepository.name);

  constructor(
    @InjectModel(SubscriptionDocument.name)
    private subscriptionModel: Model<SubscriptionDocument>
  ) {}

  async findById(id: string): Promise<Subscription | null> {
    const subDoc = await this.subscriptionModel.findById(id).exec();
    return this.safeToDomain(subDoc);
  }

  async findByUserId(userId: string): Promise<Subscription[]> {
    const subDocs = await this.subscriptionModel.find({ userId }).exec();
    return subDocs.map(doc => this.safeToDomain(doc)).filter((s): s is Subscription => s !== null);
  }

  async findActiveByUserId(userId: string): Promise<Subscription | null> {
    const subDoc = await this.subscriptionModel
      .findOne({
        userId,
        status: SubscriptionStatus.ACTIVE,
        endDate: { $gt: new Date() },
      })
      .exec();
    return this.safeToDomain(subDoc);
  }
  
  async findByStatus(status: SubscriptionStatus): Promise<Subscription[]> {
    const subDocs = await this.subscriptionModel.find({ status }).exec();
    return subDocs.map(doc => this.safeToDomain(doc)).filter((s): s is Subscription => s !== null);
  }

  async findExpiringSubscriptions(days: number): Promise<Subscription[]> {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + days);

    const subDocs = await this.subscriptionModel
      .find({
        status: SubscriptionStatus.ACTIVE,
        endDate: { $lte: targetDate },
      })
      .exec();

    return subDocs.map(doc => this.safeToDomain(doc)).filter((s): s is Subscription => s !== null);
  }

  async create(subData: Omit<Subscription, "id" | "createdAt" | "updatedAt">): Promise<Subscription> {
    const subDoc = new this.subscriptionModel(subData);
    const savedSub = await subDoc.save();
    return this.safeToDomain(savedSub)!;
  }

  async update(id: string, subData: Partial<Subscription>): Promise<Subscription | null> {
    const subDoc = await this.subscriptionModel.findByIdAndUpdate(id, subData, { new: true }).exec();
    return this.safeToDomain(subDoc);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.subscriptionModel.findByIdAndDelete(id).exec();
    return !!result;
  }
  
  async findAll(limit = 10, offset = 0): Promise<Subscription[]> {
    const subDocs = await this.subscriptionModel.find().skip(offset).limit(limit).exec();
    return subDocs.map(doc => this.safeToDomain(doc)).filter((s): s is Subscription => s !== null);
  }

  async countByStatus(status: SubscriptionStatus): Promise<number> {
    return await this.subscriptionModel.countDocuments({ status }).exec();
  }

  async findByPlanId(planId: string): Promise<Subscription[]> {
    const subDocs = await this.subscriptionModel.find({ planId }).exec();
    return subDocs.map(doc => this.safeToDomain(doc)).filter((s): s is Subscription => s !== null);
  }

  private safeToDomain(subDoc: SubscriptionDocument | null): Subscription | null {
    if (!subDoc) return null;
    try {
      return new Subscription(
        subDoc._id.toString(),
        subDoc.userId,
        subDoc.planId,
        subDoc.status as SubscriptionStatus,
        subDoc.consecutiveMonthsPaid,
        subDoc.startDate,
        subDoc.endDate,
        subDoc.createdAt,
        subDoc.updatedAt
      );
    } catch (error) {
      this.logger.error(`Error mapping subscription ${subDoc._id}: ${error}`);
      return null;
    }
  }
  
  // Mantenemos el método original por compatibilidad interna si se usa
  private toDomain(subDoc: SubscriptionDocument): Subscription {
    return this.safeToDomain(subDoc) as Subscription;
  }
}