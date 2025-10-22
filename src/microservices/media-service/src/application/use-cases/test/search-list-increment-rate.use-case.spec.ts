import { SearchMediaUseCase } from "../media/search-media.use-case";
import { ListMediaUseCase } from "../media/list-media.usecase";
import { IncrementViewCountUseCase } from "../media/increment-view.usecase";
import { UpdateRatingUseCase } from "../media/update-rating.usecase";

describe("Search/List/Increment/Rating use-cases", () => {
  it("SearchMediaUseCase should map dto to repo.search", async () => {
    const mockRepo: any = { search: jest.fn() };
    mockRepo.search.mockResolvedValue([{ id: "m1" }]);
    const uc = new SearchMediaUseCase(mockRepo);
    const dto: any = { query: "x", minRating: 3, maxRating: 7, offset: 0, limit: 10 };
    const res = await uc.execute(dto);
    expect(mockRepo.search).toHaveBeenCalledWith("x", expect.objectContaining({
      minRating: 3, maxRating: 7, offset: 0, limit: 10
    }));
    expect(res).toEqual([{ id: "m1" }]);
  });

  it("ListMediaUseCase should call findAll with defaults", async () => {
    const mockRepo: any = { findAll: jest.fn() };
    mockRepo.findAll.mockResolvedValue({ media: [], total: 0 });
    const uc = new ListMediaUseCase(mockRepo);
    const res = await uc.execute();
    expect(mockRepo.findAll).toHaveBeenCalledWith(20, 0);
    expect(res).toEqual({ media: [], total: 0 });
  });

  it("IncrementViewCountUseCase should call repo.incrementViewCount", async () => {
    const mockRepo: any = { incrementViewCount: jest.fn() };
    mockRepo.incrementViewCount.mockResolvedValue({ id: "m1", viewCount: 2 });
    const uc = new IncrementViewCountUseCase(mockRepo);
    const res = await uc.execute("m1");
    expect(mockRepo.incrementViewCount).toHaveBeenCalledWith("m1");
    expect(res).toEqual({ id: "m1", viewCount: 2 });
  });

  it("UpdateRatingUseCase should call mediaRepository.updateRating", async () => {
    const mockRepo: any = { updateRating: jest.fn() };
    mockRepo.updateRating.mockResolvedValue({ id: "m1", averageRating: 8, totalRatings: 2 });
    const uc = new UpdateRatingUseCase(mockRepo);
    const res = await uc.execute("m1", 8);
    expect(mockRepo.updateRating).toHaveBeenCalledWith("m1", 8);
    expect(res).toEqual({ id: "m1", averageRating: 8, totalRatings: 2 });
  });
});
