import { CreateProfileUseCase } from "../../use-cases/profiles/create-profile.use-case";
import { v4 as uuidv4 } from "uuid";

jest.mock("uuid", () => ({ v4: jest.fn().mockReturnValue("fixed-uuid") }));

describe("CreateProfileUseCase", () => {
  it("creates profile and returns saved value", async () => {
    const profileRepo: any = { create: jest.fn() };
    const dto = { userId: "u1", name: "Profile 1", iconUrl: "icon.png" };
    const saved = { id: "fixed-uuid", ...dto, createdAt: new Date(), updatedAt: new Date() };
    profileRepo.create.mockResolvedValue(saved);

    const uc = new CreateProfileUseCase(profileRepo);
    const res = await uc.execute(dto as any);

    expect(profileRepo.create).toHaveBeenCalledWith(expect.objectContaining({
      id: "fixed-uuid",
      userId: dto.userId,
      name: dto.name,
    }));
    expect(res).toEqual(saved);
  });
});
