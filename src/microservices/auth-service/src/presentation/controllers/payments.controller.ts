import { Controller, Post, Body } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

class PaymentDto {
  cardNumber: string;
  expiryDate?: string;
  cvv?: string;
  cardName?: string;
}

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  @Post('mock')
  async createMockPayment(@Body() body: PaymentDto) {
    // En un sistema real aquí se integraría con un proveedor de pagos.
    // Para este mock, solo devolvemos los últimos 4 dígitos y un id temporal.
    const last4 = body.cardNumber ? body.cardNumber.slice(-4) : null;
    return {
      id: `pm_mock_${Date.now()}`,
      last4,
      brand: 'mockcard',
      message: 'Mock payment saved (no real transaction)'
    };
  }
}
