// src/infrastructure/repositories/user.repository.ts

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IUserRepository } from "../../domain/repositories/user.repository.interface";
import { User } from "../../domain/entities/user.entity";
import { UserDocument } from "../database/schemas/user.schema";

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectModel(UserDocument.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async findById(id: string): Promise<User | null> {
    const userDoc = await this.userModel.findById(id).exec();
    return userDoc ? this.toDomain(userDoc) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const userDoc = await this.userModel.findOne({ email }).exec();
    return userDoc ? this.toDomain(userDoc) : null;
  }

  /**
   * Recibe una ENTIDAD User completa desde el UserFactory.
   * Esto es DDD correcto.
   */
  async create(user: User): Promise<User> {
    const payload = {
      _id: user.id,                  // mantenemos el uuid generado en la Factory
      fullName: user.fullName,
      birthDate: user.birthDate ?? null,
      email: user.email,
      password: user.password,
      currentPoints: user.currentPoints ?? 0,
    };

    const created = await new this.userModel(payload).save();
    return this.toDomain(created);
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    const doc = await this.userModel
      .findByIdAndUpdate(id, userData, { new: true })
      .exec();

    return doc ? this.toDomain(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  async findAll(limit = 10, offset = 0): Promise<User[]> {
    const docs = await this.userModel
      .find()
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();

    return docs.map((doc) => this.toDomain(doc));
  }

  // ---- Helper para convertir Mongoose → Entidad DDD ----
  private toDomain(doc: UserDocument): User {
    return new User(
      doc._id.toString(),
      doc.fullName,
      doc.birthDate ?? null,
      doc.email,
      doc.password,
      doc.currentPoints ?? 0,
      doc.createdAt,
      doc.updatedAt,
    );
  }
}
