import { Controller, Post, Body, Get, Param, Query } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from "@nestjs/swagger";
import { ProcessPaymentUseCase } from "../../application/use-cases/payments/process-payment.use-case";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PaymentDocument } from "../../infrastructure/database/schemas/payment.schema";
import { ProcessPaymentDto } from "../dtos/payments/process-payment.dto"; // ✅ ruta corregida

@ApiTags("Payments")
@Controller("payments")
export class PaymentsController {
  constructor(
    private readonly processPaymentUseCase: ProcessPaymentUseCase,
    @InjectModel(PaymentDocument.name)
    private readonly paymentModel: Model<PaymentDocument>,
  ) {}

  @Post()
  @ApiOperation({ summary: "Procesar un pago" })
  @ApiResponse({ status: 201, description: "Pago procesado correctamente" })
  async process(@Body() dto: ProcessPaymentDto) {
    return this.processPaymentUseCase.execute(
      dto.userId,
      dto.subscriptionId,
      dto.originalAmount,
      dto.pointsToUse ?? 0,
    );
  }

  @Get()
  @ApiOperation({ summary: "Listar todos los pagos" })
  @ApiQuery({ name: "userId", required: false, description: "Filtrar por ID de usuario" })
  @ApiResponse({ status: 200, description: "Lista de pagos" })
  async findAll(@Query("userId") userId?: string) {
    const filter = userId ? { userId } : {};
    return this.paymentModel.find(filter).sort({ createdAt: -1 }).lean();
  }

  @Get(":id")
  @ApiOperation({ summary: "Obtener un pago por ID" })
  @ApiParam({ name: "id", description: "ID del pago" })
  @ApiResponse({ status: 200, description: "Detalles del pago" })
  async findOne(@Param("id") id: string) {
    return this.paymentModel.findById(id).lean();
  }
}
