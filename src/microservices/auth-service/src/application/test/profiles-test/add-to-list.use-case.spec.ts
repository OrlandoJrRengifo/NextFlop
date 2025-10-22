import { NotFoundException, BadRequestException } from "@nestjs/common";
import { AddToListUseCase } from "../../use-cases/profiles/add-to-list.use-case";

describe("AddToListUseCase", () => {
  function makeMocks() {
    const profileRepo: any = {
      findById: jest.fn(),
      addToFavorites: jest.fn(),
      addToWatchLater: jest.fn(),
    };
    return { profileRepo };
  }

  it("adds to favorites successfully", async () => {
    const { profileRepo } = makeMocks();
    profileRepo.findById.mockResolvedValue({ id: "p1" });
    const updated = { id: "p1", favorites: ["m1"] };
    profileRepo.addToFavorites.mockResolvedValue(updated);

    const uc = new AddToListUseCase(profileRepo);
    const res = await uc.execute("p1", "favorites", "m1");

    expect(profileRepo.addToFavorites).toHaveBeenCalledWith("p1", "m1");
    expect(res).toEqual(updated);
  });

  it("invalid list type throws BadRequestException", async () => {
    const { profileRepo } = makeMocks();
    profileRepo.findById.mockResolvedValue({ id: "p1" });
    const uc = new AddToListUseCase(profileRepo);
    await expect(uc.execute("p1", "invalidType" as any, "m1")).rejects.toThrow(BadRequestException);
  });

  it("profile not found throws NotFoundException", async () => {
    const { profileRepo } = makeMocks();
    profileRepo.findById.mockResolvedValue(null);
    const uc = new AddToListUseCase(profileRepo);
    await expect(uc.execute("no", "favorites", "m1")).rejects.toThrow(NotFoundException);
  });
});
