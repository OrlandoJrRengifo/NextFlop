import { UpdateMediaUseCase } from "../media/update-media.use-case";

describe("UpdateMediaUseCase", () => {
  it("should lowercase genres and call repo.update", async () => {
    const mockRepo: any = { findById: jest.fn(), update: jest.fn() };
    const existing = { id: "m1", title: "old" };
    mockRepo.findById.mockResolvedValue(existing);
    mockRepo.update.mockResolvedValue({ id: "m1", title: "new", genres: ["accion"] });

    const uc = new UpdateMediaUseCase(mockRepo);
    const dto: any = { title: "new", genres: ["Accion"] };

    const res = await uc.execute("m1", dto);
    expect(mockRepo.update).toHaveBeenCalledWith("m1", expect.objectContaining({ genres: ["accion"] }));
    expect(res).toEqual({ id: "m1", title: "new", genres: ["accion"] });
  });

  it("should throw if media not found", async () => {
    const mockRepo: any = { findById: jest.fn(), update: jest.fn() };
    mockRepo.findById.mockResolvedValue(null);
    const uc = new UpdateMediaUseCase(mockRepo);
    await expect(uc.execute("nope", {} as any)).rejects.toThrow("Media not found");
  });
});
