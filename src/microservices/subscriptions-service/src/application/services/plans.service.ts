import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Plan, PlanDocument } from "../../domain/schemas/plan.schema";

@Injectable()
export class PlansService implements OnModuleInit {
  constructor(@InjectModel(Plan.name) private planModel: Model<PlanDocument>) {}

  async onModuleInit() {
    await this.seedPlans();
  }

  async findAll() {
    return this.planModel.find({ active: true }).lean().exec();
  }

  async findById(id: string) {
    return this.planModel.findById(id).lean().exec();
  }

  async findByName(name: string) {
    return this.planModel.findOne({ name }).lean().exec();
  }

  async create(payload: Partial<Plan>) {
    const plan = new this.planModel(payload);
    return plan.save();
  }

  async update(id: string, payload: Partial<Plan>) {
    return this.planModel.findByIdAndUpdate(id, payload, { new: true }).exec();
  }

  async seedPlans() {
    const plans = [
      {
        name: "Básico",
        price: 4.99,
        description: "Acceso básico con calidad SD",
        maxProfiles: 1,
        maxQuality: "SD",
        features: ["Acceso a catálogo completo", "Calidad SD", "Un dispositivo simultáneamente"],
        active: true,
      },
      {
        name: "Estándar",
        price: 9.99,
        description: "Acceso estándar con calidad HD",
        maxProfiles: 2,
        maxQuality: "HD",
        features: ["Acceso a catálogo completo", "Calidad HD", "Dos dispositivos simultáneamente"],
        active: true,
      },
      {
        name: "Premium",
        price: 15.99,
        description: "Acceso premium con calidad 4K",
        maxProfiles: 4,
        maxQuality: "4K",
        features: ["Acceso a catálogo completo", "Calidad 4K", "Cuatro dispositivos simultáneamente", "Contenido exclusivo"],
        active: true,
      },
    ];

    const existing = await this.planModel.countDocuments();
    if (existing === 0) {
      await this.planModel.insertMany(plans);
      console.log("✅ Plans seeded");
    }
  }
}
