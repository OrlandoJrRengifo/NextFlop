import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IUserRepository } from "../../domain/repositories/user.repository.interface";
import { User } from "../../domain/entities/user.entity";
import { UserDocument } from "../database/schemas/user.schema";

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectModel(UserDocument.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findById(id: string): Promise<User | null> {
    const userDoc = await this.userModel.findById(id).exec();
    return userDoc ? this.toDomain(userDoc) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const userDoc = await this.userModel.findOne({ email }).exec();
    return userDoc ? this.toDomain(userDoc) : null;
  }

  async create(userData: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    const userDoc = new this.userModel(userData);
    const savedUser = await userDoc.save();
    return this.toDomain(savedUser);
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    const userDoc = await this.userModel.findByIdAndUpdate(id, userData, { new: true }).exec();
    return userDoc ? this.toDomain(userDoc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  async findAll(limit = 10, offset = 0): Promise<User[]> {
    const userDocs = await this.userModel.find().skip(offset).limit(limit).exec();
    return userDocs.map((doc) => this.toDomain(doc));
  }
  
  // Helper para convertir el documento de Mongoose a la entidad de dominio
  private toDomain(userDoc: UserDocument): User {
    return new User(
      userDoc._id.toString(),
      userDoc.fullName,
      userDoc.birthDate,
      userDoc.email,
      userDoc.password,
      userDoc.currentPoints,
      userDoc.createdAt,
      userDoc.updatedAt
    );
  }
}