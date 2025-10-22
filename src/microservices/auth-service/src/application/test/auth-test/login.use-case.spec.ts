import { UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { LoginUseCase } from "../../use-cases/auth/login.use-case";

describe("LoginUseCase", () => {
  const mockUser = {
    id: "user-1",
    email: "test@example.com",
    password: bcrypt.hashSync("secret", 10),
    fullName: "Test User",
  };

  function makeMocks() {
    const userRepo: any = { findByEmail: jest.fn() };
    const jwtService: any = { sign: jest.fn().mockReturnValue("token123") };
    return { userRepo, jwtService };
  }

  it("successful login returns user and token", async () => {
    const { userRepo, jwtService } = makeMocks();
    userRepo.findByEmail.mockResolvedValue(mockUser);
    
    const uc = new LoginUseCase(userRepo, jwtService);
    const res = await uc.execute(mockUser.email, "secret");
    expect(userRepo.findByEmail).toHaveBeenCalledWith(mockUser.email);
    expect(jwtService.sign).toHaveBeenCalledWith(expect.objectContaining({
      sub: mockUser.id, email: mockUser.email, fullName: mockUser.fullName
    }));
    expect(res).toHaveProperty("user");
    expect(res).toHaveProperty("accessToken", "token123");
  });

  it("invalid email throws UnauthorizedException", async () => {
    const { userRepo, jwtService } = makeMocks();
    userRepo.findByEmail.mockResolvedValue(null);
    const uc = new LoginUseCase(userRepo, jwtService);
    await expect(uc.execute("noone@example.com", "secret")).rejects.toThrow(UnauthorizedException);
  });

  it("wrong password throws UnauthorizedException", async () => {
    const { userRepo, jwtService } = makeMocks();
    userRepo.findByEmail.mockResolvedValue(mockUser);
    const uc = new LoginUseCase(userRepo, jwtService);
    await expect(uc.execute(mockUser.email, "wrong")).rejects.toThrow(UnauthorizedException);
  });
});
