import { Controller, Get, Post, Put, Delete, Param, UseGuards, Body } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { CreateProfileUseCase } from "../../application/use-cases/profiles/create-profile.use-case";
import { GetProfileUseCase } from "../../application/use-cases/profiles/get-profile.use-case";
import { UpdateProfileUseCase } from "../../application/use-cases/profiles/update-profile.use-case";
import { AddToListUseCase } from "../../application/use-cases/profiles/add-to-list.use-case";
import { RemoveFromListUseCase } from "../../application/use-cases/profiles/remove-from-list.use-case";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";

@ApiTags("profiles")
@Controller("profiles")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProfilesController {
  constructor(
    private readonly createProfileUseCase: CreateProfileUseCase,
    private readonly getProfileUseCase: GetProfileUseCase,
    private readonly updateProfileUseCase: UpdateProfileUseCase,
    private readonly addToListUseCase: AddToListUseCase,
    private readonly removeFromListUseCase: RemoveFromListUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: "Create profile" })
  @ApiResponse({ status: 201, description: "Profile created successfully" })
  async createProfile(@Body() profileData: any) {
    return this.createProfileUseCase.execute(profileData);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get profile by ID' })
  @ApiResponse({ status: 200, description: 'Profile found successfully' })
  async getProfile(@Param('id') id: string) {
    return this.getProfileUseCase.execute(id);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update profile" })
  @ApiResponse({ status: 200, description: "Profile updated successfully" })
  async updateProfile(@Param('id') id: string, @Body() updateData: any) {
    return this.updateProfileUseCase.execute(id, updateData);
  }

  @Post(":id/list/:listType")
  @ApiOperation({ summary: "Add item to list" })
  @ApiResponse({ status: 200, description: "Item added to list successfully" })
  async addToList(
    @Param('id') profileId: string, 
    @Param('listType') listType: 'favorites' | 'watchLater', 
    @Body() itemData: { mediaId: string }
  ) {
    return this.addToListUseCase.execute(profileId, listType, itemData.mediaId);
  }

  @Delete(":id/list/:listType/:mediaId")
  @ApiOperation({ summary: "Remove item from list" })
  @ApiResponse({ status: 200, description: "Item removed from list successfully" })
  async removeFromList(
    @Param('id') profileId: string,
    @Param('listType') listType: 'favorites' | 'watchLater',
    @Param('mediaId') mediaId: string,
  ) {
    return this.removeFromListUseCase.execute(profileId, listType, mediaId);
  }
}