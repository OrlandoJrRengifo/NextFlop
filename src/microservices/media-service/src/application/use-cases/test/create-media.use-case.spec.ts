import { CreateMediaUseCase } from "../media/create-media.use-case";

describe("CreateMediaUseCase", () => {
  it("should call repo.create with normalized genres and return created media", async () => {
    const mockRepo: any = { create: jest.fn() };
    const dto = {
      title: "Test",
      description: "desc",
      type: "movie",
      genres: ["Action", "Drama"],
      rating: 5,
      maturityRating: "PG",
      releaseYear: 2020,
      duration: 120,
//      posterUrl: "",
//      trailerUrl: "",
      isActive: true,
    };

    const saved = { id: "1", ...dto, genres: ["action", "drama"], createdAt: new Date(), updatedAt: new Date() };
    mockRepo.create.mockResolvedValue(saved);

    const uc = new CreateMediaUseCase(mockRepo);
    const result = await uc.execute(dto as any);

    expect(mockRepo.create).toHaveBeenCalled();
    expect(mockRepo.create).toHaveBeenCalledWith(expect.objectContaining({
      title: dto.title,
      genres: ["action", "drama"]
    }));
    expect(result).toEqual(saved);
  });
});
