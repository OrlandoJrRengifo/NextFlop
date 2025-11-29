import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ISubscriptionPlanRepository } from "../../domain/repositories/subscription-plan.repository.interface";
import { SubscriptionPlan } from "../../domain/entities/subscription-plan.entity";
import { SubscriptionPlanDocument } from "../database/schemas/subscription-plan.schema";

@Injectable()
export class SubscriptionPlanRepository
  implements ISubscriptionPlanRepository
{
  constructor(
    @InjectModel("SubscriptionPlan")
    private readonly planModel: Model<SubscriptionPlanDocument>,
  ) {}

  async findById(id: string): Promise<SubscriptionPlan | null> {
    const doc = await this.planModel.findById(id).exec();
    return doc ? this.toDomain(doc) : null;
  }

  async findByName(name: string): Promise<SubscriptionPlan | null> {
    const doc = await this.planModel.findOne({ name }).exec();
    return doc ? this.toDomain(doc) : null;
  }

  async findAll(): Promise<SubscriptionPlan[]> {
    const docs = await this.planModel.find().exec();
    return docs.map((doc) => this.toDomain(doc));
  }

  async create(
    planData: Omit<SubscriptionPlan, "id" | "createdAt" | "updatedAt">,
  ): Promise<SubscriptionPlan> {
    const created = new this.planModel(planData);
    const saved = await created.save();
    return this.toDomain(saved);
  }

  async update(
    id: string,
    data: Partial<SubscriptionPlan>,
  ): Promise<SubscriptionPlan | null> {
    const updated = await this.planModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    return updated ? this.toDomain(updated) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.planModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  private toDomain(doc: SubscriptionPlanDocument): SubscriptionPlan {
    return new SubscriptionPlan(
      doc._id.toString(),
      doc.name,
      doc.price,
      doc.maxProfiles,
      doc.createdAt,
      doc.updatedAt,
    );
  }
}
