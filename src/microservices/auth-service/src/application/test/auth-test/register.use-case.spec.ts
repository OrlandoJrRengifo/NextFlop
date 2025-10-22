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

    userFactory.createFromRegistration.mockImplementation((fullName, email, hashed) => ({
      id: "u1",
      fullName,
      email,
      password: hashed,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    userRepo.create.mockImplementation(async (u: any) => ({ ...u, id: "u1" }));

    const hashSpy = jest.spyOn(bcrypt as unknown as any, "hash")
    hashSpy.mockResolvedValue("hashed-pass");
    const uc = new RegisterUseCase(userRepo, jwtService, userFactory);
    const result = await uc.execute("new@example.com", "pass123", "New User");

    expect(userRepo.findByEmail).toHaveBeenCalledWith("new@example.com");
    expect(userFactory.createFromRegistration).toHaveBeenCalledWith(
      "New User",
      "new@example.com",
      expect.any(String)
    );

    expect(hashSpy).toHaveBeenCalledWith("pass123", 12);
    expect(userRepo.create).toHaveBeenCalled();
    expect(jwtService.sign).toHaveBeenCalled();
    expect(result).toHaveProperty("accessToken", "jwt-token");

    hashSpy.mockRestore();
  });

  it("existing email throws ConflictException", async () => {
    const { userRepo, jwtService, userFactory } = makeMocks();
    userRepo.findByEmail.mockResolvedValue({ id: "exists", email: "a@a.com" });
    const uc = new RegisterUseCase(userRepo, jwtService, userFactory);
    await expect(uc.execute("a@a.com", "p", "Name")).rejects.toThrow(ConflictException);
  });
});
