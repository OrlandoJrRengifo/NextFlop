// src/domain/entities/user.entity.ts

export class User {
  constructor(
    public readonly id: string,
    public readonly fullName: string,
    public readonly birthDate: Date,
    public readonly email: string,
    public readonly password: string, // La entidad aún necesita la contraseña para la lógica de negocio
    public readonly currentPoints: number,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  // Se pueden añadir métodos de negocio simples que dependan de estos campos si es necesario
  public canSpendPoints(amount: number): boolean {
    return this.currentPoints >= amount && amount > 0;
  }
}