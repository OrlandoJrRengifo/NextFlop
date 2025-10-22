import { GetMediaUseCase } from "../media/get-media.use-case";
import { DeleteMediaUseCase } from "../media/delete-media.use-case";

describe("GetMediaUseCase & DeleteMediaUseCase", () => {
  it("GetMediaUseCase should return media when found and throw when not", async () => {
    const mockRepo: any = { findById: jest.fn() };
    const media = { id: "m1", title: "x" };
    mockRepo.findById.mockResolvedValueOnce(media);
    const getUc = new GetMediaUseCase(mockRepo);

    await expect(getUc.execute("m1")).resolves.toEqual(media);

    mockRepo.findById.mockResolvedValueOnce(null);
    await expect(getUc.execute("nope")).rejects.toThrow("Media not found");
  });

  it("DeleteMediaUseCase should call repo.delete when media exists and throw otherwise", async () => {
    const mockRepo: any = { findById: jest.fn(), delete: jest.fn() };
    mockRepo.findById.mockResolvedValueOnce({ id: "m1" });
    mockRepo.delete.mockResolvedValueOnce(true);

    const delUc = new DeleteMediaUseCase(mockRepo);
    await expect(delUc.execute("m1")).resolves.toBeTruthy();
    expect(mockRepo.delete).toHaveBeenCalledWith("m1");

    mockRepo.findById.mockResolvedValueOnce(null);
    await expect(delUc.execute("nope")).rejects.toThrow("Media not found");
  });
});
