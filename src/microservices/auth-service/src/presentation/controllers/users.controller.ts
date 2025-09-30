import { Controller, Get, Put, Body, UseGuards, Param } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
// Se quita 'type' de las importaciones
import { GetUserUseCase } from "../../application/use-cases/users/get-user.use-case";
import { UpdateUserUseCase } from "../../application/use-cases/users/update-user.use-case";
import { AddPointsUseCase } from "../../application/use-cases/users/add-points.use-case";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";

@ApiTags("users")
@Controller("users")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(
    private readonly getUserUseCase: GetUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly addPointsUseCase: AddPointsUseCase,
  ) {}

  @Get(":id")
  @ApiOperation({ summary: "Get user by ID" })
  @ApiResponse({ status: 200, description: "User found successfully" })
  async getUser(@Param("id") id: string) { // Se añade @Param()
    return this.getUserUseCase.execute(id);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update user" })
  @ApiResponse({ status: 200, description: "User updated successfully" })
  async updateUser(@Param("id") id: string, @Body() updateData: any) { // Se añade @Param()
    return this.updateUserUseCase.execute(id, updateData);
  }

  @Put(":id/points")
  @ApiOperation({ summary: "Add points to user" })
  @ApiResponse({ status: 200, description: "Points added successfully" })
  async addPoints(@Param("id") id: string, @Body() pointsData: { points: number; reason: string }) { // Se añade @Param()
    return this.addPointsUseCase.execute(id, pointsData.points, pointsData.reason);
  }
}