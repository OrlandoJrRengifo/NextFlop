import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { FavoriteDto } from './dto/favorite.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth()
@Controller('api/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: any) {
    const userId = req.user?.userId;
    return this.usersService.findById(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('me')
  async updateMe(@Req() req: any, @Body() dto: UpdateUserDto) {
    const userId = req.user?.userId;
    return this.usersService.update(userId, dto as any);
  }

  @UseGuards(JwtAuthGuard)
  @Post('favorites')
  async addFavorite(@Req() req: any, @Body() dto: FavoriteDto) {
    const userId = req.user?.userId;
    return this.usersService.addFavorite(userId, dto.movieId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('favorites/:movieId')
  async removeFavorite(@Req() req: any, @Param('movieId') movieId: string) {
    const userId = req.user?.userId;
    return this.usersService.removeFavorite(userId, movieId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('watchlist')
  async addToWatchlist(@Req() req: any, @Body() dto: FavoriteDto) {
    const userId = req.user?.userId;
    return this.usersService.addToWatchlist(userId, dto.movieId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('watchlist/:movieId')
  async removeFromWatchlist(@Req() req: any, @Param('movieId') movieId: string) {
    const userId = req.user?.userId;
    return this.usersService.removeFromWatchlist(userId, movieId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('history')
  async addHistory(@Req() req: any, @Body() item: any) {
    const userId = req.user?.userId;
    return this.usersService.addHistoryItem(userId, item);
  }

  @UseGuards(JwtAuthGuard)
  @Get('points')
  async points(@Req() req: any) {
    const userId = req.user?.userId;
    const user = await this.usersService.findById(userId);
    return { points: user?.points || 0 };
  }

  @UseGuards(JwtAuthGuard)
  @Post('points/redeem')
  async redeemPoints(@Req() req: any, @Body() body: { amount: number }) {
    const userId = req.user?.userId;
    // subtract points
    return this.usersService.adjustPoints(userId, -Math.abs(body.amount || 0));
  }

  // Profiles
  @UseGuards(JwtAuthGuard)
  @Get('profiles')
  async listProfiles(@Req() req: any) {
    const userId = req.user?.userId;
    return this.usersService.getProfiles(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profiles')
  async createProfile(@Req() req: any, @Body() dto: any) {
    const userId = req.user?.userId;
    return this.usersService.addProfile(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profiles/:profileId')
  async editProfile(@Req() req: any, @Param('profileId') profileId: string, @Body() dto: any) {
    const userId = req.user?.userId;
    return this.usersService.updateProfile(userId, profileId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('profiles/:profileId')
  async deleteProfile(@Req() req: any, @Param('profileId') profileId: string) {
    const userId = req.user?.userId;
    return this.usersService.removeProfile(userId, profileId);
  }
}
