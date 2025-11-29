// src/application/use-cases/auth-test/register.use-case.spec.ts

import { ConflictException } from "@nestjs/common";
import { RegisterUseCase } from "../../use-cases/auth/register.use-case";
import * as bcrypt from "bcryptjs";

describe("RegisterUseCase", () => {
  function makeMocks() {
    const userRepo: any = { findByEmail: jest.fn(), create: jest.fn() };
    const jwtService: any = { sign: jest.fn().mockReturnValue("jwt-token") };
    const userFactory: any = { createFromRegistration: jest.fn() };
    return { userRepo, jwtService, userFactory };
  }

  it("creates user, signs token and returns both", async () => {
    const { userRepo, jwtService, userFactory } = makeMocks();
    userRepo.findByEmail.mockResolvedValue(null);

    userFactory.createFromRegistration.mockImplementation(
      (fullName, email, hashedPassword, birthDate) => ({
        id: "u1",
        fullName,
        email,
        birthDate,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    );

    userRepo.create.mockImplementation(async (u: any) => ({
      ...u,
      id: "u1",
    }));

    const hashSpy = jest.spyOn(bcrypt as any, "hash");
    hashSpy.mockResolvedValue("hashed-pass");

    const uc = new RegisterUseCase(userRepo, jwtService, userFactory);

    const result = await uc.execute({
      email: "new@example.com",
      password: "pass123",
      fullName: "New User",
      birthDate: "1990-01-01",
    });

    expect(userRepo.findByEmail).toHaveBeenCalledWith("new@example.com");

    expect(userFactory.createFromRegistration).toHaveBeenCalledWith(
      "New User",
      "new@example.com",
      "hashed-pass",
      "1990-01-01"
    );

    expect(hashSpy).toHaveBeenCalledWith("pass123", 12);
    expect(userRepo.create).toHaveBeenCalled();
    expect(jwtService.sign).toHaveBeenCalled();
    expect(result).toHaveProperty("accessToken", "jwt-token");

    hashSpy.mockRestore();
  });

  it("existing email throws ConflictException", async () => {
    const { userRepo, jwtService, userFactory } = makeMocks();
    userRepo.findByEmail.mockResolvedValue({
      id: "exists",
      email: "a@a.com",
    });

    const uc = new RegisterUseCase(userRepo, jwtService, userFactory);

    await expect(
      uc.execute({
        email: "a@a.com",
        password: "p",
        fullName: "Name",
        birthDate: "1990-01-01",
      })
    ).rejects.toThrow(ConflictException);
  });
});
