import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ISubscriptionPlanRepository } from "../../domain/repositories/subscription-plan.repository.interface";
import { SubscriptionPlan } from "../../domain/entities/subscription-plan.entity";
import { SubscriptionPlanDocument } from "../database/schemas/subscription-plan.schema";

@Injectable()
export class SubscriptionPlanRepository implements ISubscriptionPlanRepository {
  constructor(
    @InjectModel(SubscriptionPlanDocument.name)
    private planModel: Model<SubscriptionPlanDocument>,
  ) {}

  async findById(id: string): Promise<SubscriptionPlan | null> {
    const planDoc = await this.planModel.findById(id).exec();
    return planDoc ? this.toDomain(planDoc) : null;
  }

  async findByName(name: string): Promise<SubscriptionPlan | null> {
    const planDoc = await this.planModel.findOne({ name }).exec();
    return planDoc ? this.toDomain(planDoc) : null;
  }

  async findAll(): Promise<SubscriptionPlan[]> {
    const planDocs = await this.planModel.find().exec();
    return planDocs.map((doc) => this.toDomain(doc));
  }

  async create(planData: Omit<SubscriptionPlan, "id" | "createdAt" | "updatedAt">): Promise<SubscriptionPlan> {
    const planDoc = new this.planModel(planData);
    const savedPlan = await planDoc.save();
    return this.toDomain(savedPlan);
  }

  async update(id: string, planData: Partial<SubscriptionPlan>): Promise<SubscriptionPlan | null> {
    const planDoc = await this.planModel.findByIdAndUpdate(id, planData, { new: true }).exec();
    return planDoc ? this.toDomain(planDoc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.planModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  // Helper method to convert MongoDB document to domain entity
  private toDomain(planDoc: SubscriptionPlanDocument): SubscriptionPlan {
    return new SubscriptionPlan(
      planDoc._id.toString(),
      planDoc.name,
      planDoc.price,
      planDoc.maxProfiles,
      planDoc.createdAt,
      planDoc.updatedAt,
    );
  }
}