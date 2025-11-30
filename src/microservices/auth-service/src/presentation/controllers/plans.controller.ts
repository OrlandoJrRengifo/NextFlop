import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('plans')
@Controller('plans')
export class PlansController {
  @Get()
  getPlans() {
    // Datos estáticos de ejemplo
    const plans = [
      {
        id: 'basic',
        name: 'Básico',
        price: 9.99,
        quality: 'HD',
        devices: 1,
        simultaneousScreens: 1,
        downloads: false,
        pointsPerRenewal: 50,
        features: ['Calidad HD', '1 dispositivo a la vez', 'Catálogo completo'],
      },
      {
        id: 'medium',
        name: 'Medium',
        price: 14.99,
        quality: 'Full HD',
        devices: 2,
        simultaneousScreens: 2,
        downloads: true,
        pointsPerRenewal: 100,
        features: ['Calidad Full HD', '2 dispositivos simultáneos', 'Descargas ilimitadas'],
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 19.99,
        quality: '4K Ultra HD',
        devices: 4,
        simultaneousScreens: 4,
        downloads: true,
        pointsPerRenewal: 200,
        features: ['Calidad 4K', '4 dispositivos', 'Audio Dolby Atmos'],
      },
    ];

    return plans;
  }
}
