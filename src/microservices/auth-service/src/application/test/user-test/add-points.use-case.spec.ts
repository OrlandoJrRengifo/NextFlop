import { BadRequestException, NotFoundException } from "@nestjs/common";
import { AddPointsUseCase } from "../../use-cases/users/add-points.use-case";
import { EventPublisher } from "../../services/event-publisher.service";

describe("AddPointsUseCase", () => {
  function makeMocks() {
    const userRepo: any = { findById: jest.fn(), update: jest.fn() };
    const eventPublisher: any = { publishPointsUpdated: jest.fn() };
    return { userRepo, eventPublisher };
  }

  it("updates points and publishes event", async () => {
    const { userRepo, eventPublisher } = makeMocks();
    const user = { id: "u1", currentPoints: 10 };
    userRepo.findById.mockResolvedValue(user);
    userRepo.update.mockResolvedValue({ ...user, currentPoints: 30 });
    eventPublisher.publishPointsUpdated.mockResolvedValue(undefined);

    const uc = new AddPointsUseCase(userRepo, eventPublisher);
    const res = await uc.execute("u1", 20, "promo");

    expect(userRepo.findById).toHaveBeenCalledWith("u1");
    expect(userRepo.update).toHaveBeenCalledWith("u1", expect.objectContaining({ currentPoints: 30 }));
    expect(eventPublisher.publishPointsUpdated).toHaveBeenCalledWith(expect.objectContaining({
      userId: "u1",
      previousPoints: 10,
      currentPoints: 30,
    }));
    expect(res).toHaveProperty("message", "Points updated successfully");
  });

  it("invalid points throws BadRequestException", async () => {
    const { userRepo, eventPublisher } = makeMocks();
    const uc = new AddPointsUseCase(userRepo, eventPublisher);
    await expect(uc.execute("u1", NaN, "reason")).rejects.toThrow(BadRequestException);
  });

  it("user not found throws NotFoundException", async () => {
    const { userRepo, eventPublisher } = makeMocks();
    userRepo.findById.mockResolvedValue(null);
    const uc = new AddPointsUseCase(userRepo, eventPublisher);
    await expect(uc.execute("no", 10, "r")).rejects.toThrow(NotFoundException);
  });
});
