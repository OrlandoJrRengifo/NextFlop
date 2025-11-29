import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Subscription, SubscriptionDocument } from "../../domain/schemas/subscription.schema";

@Injectable()
export class SubscriptionsService {
  constructor(@InjectModel(Subscription.name) private subModel: Model<SubscriptionDocument>) {}

  async findByUserId(userId: string) {
    return this.subModel.findOne({ userId }).sort({ createdAt: -1 }).lean().exec();
  }

  async findById(id: string) {
    return this.subModel.findById(id).lean().exec();
  }

  async create(payload: Partial<Subscription>) {
    const sub = new this.subModel(payload);
    return sub.save();
  }

  async update(id: string, payload: Partial<Subscription>) {
    return this.subModel.findByIdAndUpdate(id, payload, { new: true }).exec();
  }

  async cancel(id: string, reason?: string) {
    return this.subModel.findByIdAndUpdate(id, { status: "cancelled", cancelledAt: new Date(), cancelReason: reason }, { new: true }).exec();
  }

  async reactivate(id: string) {
    const sub = await this.subModel.findById(id).exec();
    if (!sub) throw new Error("Subscription not found");
    const now = new Date();
    const daysLeft = Math.ceil((sub.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const newEndDate = new Date(now.getTime() + Math.max(daysLeft, 30) * 24 * 60 * 60 * 1000);
    return this.subModel.findByIdAndUpdate(id, { status: "active", cancelledAt: null, endDate: newEndDate }, { new: true }).exec();
  }
}
