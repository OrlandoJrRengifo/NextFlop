import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ISubscriptionPlanRepository } from "../../domain/repositories/subscription-plan.repository.interface";
import { SubscriptionPlan } from "../../domain/entities/subscription-plan.entity";
import { SubscriptionPlanDocument, SubscriptionPlan as SubscriptionPlanSchema } from "../database/schemas/subscription-plan.schema";

@Injectable()
export class SubscriptionPlanRepository implements ISubscriptionPlanRepository {
  constructor(
    @InjectModel(SubscriptionPlanSchema.name)
    private readonly planModel: Model<SubscriptionPlanDocument>
  ) {}

  async findAll(): Promise<SubscriptionPlan[]> {
    const plans = await this.planModel.find().exec();
    // Solución Raíz: Filtramos nulos para que un registro corrupto no tumbe la app
    if (!plans) return [];
    return plans
      .map(plan => this.safeToDomain(plan))
      .filter((plan): plan is SubscriptionPlan => plan !== null);
  }

  async findById(id: string): Promise<SubscriptionPlan | null> {
    const plan = await this.planModel.findById(id).exec();
    return plan ? this.safeToDomain(plan) : null;
  }

  async findByName(name: string): Promise<SubscriptionPlan | null> {
    const plan = await this.planModel.findOne({ name }).exec();
    return plan ? this.safeToDomain(plan) : null;
  }

  async create(plan: SubscriptionPlan): Promise<SubscriptionPlan> {
    const newPlan = new this.planModel({
      name: plan.name,
      price: plan.price,
      maxProfiles: plan.maxProfiles,
    });
    const savedPlan = await newPlan.save();
    return this.safeToDomain(savedPlan)!;
  }

  async update(id: string, planData: Partial<SubscriptionPlan>): Promise<SubscriptionPlan | null> {
    const updatePayload: any = {};
    if (planData.name) updatePayload.name = planData.name;
    if (planData.price !== undefined) updatePayload.price = planData.price;
    if (planData.maxProfiles) updatePayload.maxProfiles = planData.maxProfiles;

    const updatedPlan = await this.planModel
      .findByIdAndUpdate(id, updatePayload, { new: true })
      .exec();

    return updatedPlan ? this.safeToDomain(updatedPlan) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.planModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  // Método seguro que no explota si faltan campos
  private safeToDomain(doc: SubscriptionPlanDocument): SubscriptionPlan | null {
    try {
      if (!doc) return null;
      return new SubscriptionPlan(
        doc._id ? doc._id.toString() : 'temp-id',
        doc.name || 'Sin nombre',
        doc.price !== undefined ? doc.price : 0,
        doc.maxProfiles || 1,
        doc.createdAt instanceof Date ? doc.createdAt : new Date(),
        doc.updatedAt instanceof Date ? doc.updatedAt : new Date()
      );
    } catch (e) {
      console.error(`Error mapeando plan ${doc?._id}:`, e);
      return null;
    }
  }
}