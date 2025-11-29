import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(payload: Partial<User>) {
    const created = new this.userModel(payload);
    return created.save();
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string) {
    return this.userModel.findById(id).exec();
  }

  async update(id: string, update: Partial<User>) {
    return this.userModel.findByIdAndUpdate(id, update, { new: true }).exec();
  }

  async addFavorite(id: string, movieId: string) {
    return this.userModel.findByIdAndUpdate(id, { $addToSet: { favorites: movieId } }, { new: true }).exec();
  }

  async removeFavorite(id: string, movieId: string) {
    return this.userModel.findByIdAndUpdate(id, { $pull: { favorites: movieId } }, { new: true }).exec();
  }

  async addToWatchlist(id: string, movieId: string) {
    return this.userModel.findByIdAndUpdate(id, { $addToSet: { watchlist: movieId } }, { new: true }).exec();
  }

  async removeFromWatchlist(id: string, movieId: string) {
    return this.userModel.findByIdAndUpdate(id, { $pull: { watchlist: movieId } }, { new: true }).exec();
  }

  async addHistoryItem(id: string, item: any) {
    return this.userModel.findByIdAndUpdate(id, { $push: { history: item } }, { new: true }).exec();
  }

  async adjustPoints(id: string, delta: number) {
    return this.userModel.findByIdAndUpdate(id, { $inc: { points: delta } }, { new: true }).exec();
  }

  // Profiles management
  async getProfiles(id: string) {
    const user = await this.userModel.findById(id).select('profiles').lean().exec();
    return user?.profiles || [];
  }

  async addProfile(id: string, profile: { name: string; icon?: string }) {
    const profileObj = { id: uuidv4(), name: profile.name, icon: profile.icon || null, createdAt: new Date() };
    await this.userModel.findByIdAndUpdate(id, { $push: { profiles: profileObj } }).exec();
    return profileObj;
  }

  async updateProfile(id: string, profileId: string, update: Partial<{ name: string; icon?: string }>) {
    const user = await this.userModel.findOneAndUpdate(
      { _id: id, 'profiles.id': profileId },
      { $set: { 'profiles.$.name': update.name, 'profiles.$.icon': update.icon } },
      { new: true },
    ).exec();
    return user?.profiles?.find((p: any) => p.id === profileId) || null;
  }

  async removeProfile(id: string, profileId: string) {
    return this.userModel.findByIdAndUpdate(id, { $pull: { profiles: { id: profileId } } }, { new: true }).exec();
  }
}
