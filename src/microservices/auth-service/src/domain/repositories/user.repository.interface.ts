// src/domain/repositories/user.repository.interface.ts

import type { User } from "../entities/user.entity";

// Tipo para los datos de creación, que no incluye métodos
export type CreateUserData = Omit<User, "id" | "createdAt" | "updatedAt" | "canSpendPoints">;

export const USER_REPOSITORY = "IUserRepository"; // Cambiado a string para consistencia

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: CreateUserData): Promise<User>;
  update(id: string, user: Partial<User>): Promise<User | null>;
  delete(id: string): Promise<boolean>;
  findAll(limit?: number, offset?: number): Promise<User[]>;
}