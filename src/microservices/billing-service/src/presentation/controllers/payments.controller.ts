import { Controller, Post, Body, Get, Param, Query, UseGuards, Req } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBearerAuth } from "@nestjs/swagger";
import { Request } from 'express';
import { ProcessPaymentUseCase } from "../../application/use-cases/payments/process-payment.use-case";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PaymentDocument } from "../../infrastructure/database/schemas/payment.schema";
import { ProcessPaymentDto } from "../dtos/payments/process-payment.dto";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";

@ApiTags("Payments")
@Controller("payments") // <--- CAMBIO: Agregamos prefijo 'payments'
export class PaymentsController {
  constructor(
    private readonly processPaymentUseCase: ProcessPaymentUseCase,
    @InjectModel(PaymentDocument.name)
    private readonly paymentModel: Model<PaymentDocument>,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard) // <--- CRÍTICO: Agregamos el Guard para obtener el usuario
  @ApiBearerAuth()         // Documentación Swagger
  @ApiOperation({ summary: "Procesar un pago" })
  @ApiResponse({ status: 201, description: "Pago procesado correctamente" })
  async process(@Body() dto: ProcessPaymentDto, @Req() request: Request) {
    const user = request.user as any;

    return this.processPaymentUseCase.execute({
      userId: user.userId, // Ahora sí existe user.userId
      subscriptionId: dto.subscriptionId,
      originalAmount: dto.originalAmount,
      pointsToRedeem: dto.pointsToRedeem ?? 0,
      cardNumber: dto.cardNumber,
      expiration: dto.expiration,
      cvv: dto.cvv,
      nameOnCard: dto.nameOnCard,
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard) // Opcional: Proteger historial
  @ApiOperation({ summary: "Listar todos los pagos" })
  @ApiQuery({ name: "userId", required: false })
  @ApiResponse({ status: 200, description: "Lista de pagos" })
  async findAll(@Query("userId") userId?: string) {
    const filter = userId ? { userId } : {};
    return this.paymentModel.find(filter).sort({ createdAt: -1 }).lean();
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Obtener un pago por ID" })
  @ApiParam({ name: "id", description: "ID del pago" })
  @ApiResponse({ status: 200, description: "Detalles del pago" })
  async findOne(@Param("id") id: string) {
    return this.paymentModel.findById(id).lean();
  }
}