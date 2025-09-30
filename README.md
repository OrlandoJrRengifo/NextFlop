# Nextflop - Netflix-like Platform Microservices

Una plataforma tipo Netflix desarrollada con arquitectura de microservicios usando NestJS, MongoDB y RabbitMQ.

## Arquitectura

### Microservicios

1. **Auth-Users Service** (Puerto 3001)
   - Gestión de usuarios, perfiles y listas
   - Manejo de saldo de puntos
   - Autenticación JWT

2. **Subscriptions Service** (Puerto 3002)
   - Gestión de planes de suscripción
   - Creación, cancelación y renovación

3. **Billing Service** (Puerto 3003)
   - Procesamiento de pagos con Stripe
   - Canje de puntos por descuentos
   - Strategy Pattern para descuentos

4. **Media Service** (Puerto 3004)
   - Catálogo de películas
   - Búsqueda y filtros

### Tecnologías

- **Backend**: NestJS (Node.js + TypeScript)
- **Base de datos**: MongoDB (una instancia por microservicio)
- **Mensajería**: RabbitMQ
- **Contenedores**: Docker & Docker Compose
- **Documentación**: Swagger/OpenAPI
- **Pagos**: Stripe (sandbox)

## Instalación y Ejecución

### Prerrequisitos

- Docker y Docker Compose
- Node.js 18+ (para desarrollo local)

### Ejecutar con Docker

\`\`\`bash
# Clonar el repositorio
git clone <repository-url>
cd nextflop-microservices

# Levantar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar servicios
docker-compose down
\`\`\`

### URLs de los Servicios

- **Auth Service**: http://localhost:3001
- **Subscriptions Service**: http://localhost:3002
- **Billing Service**: http://localhost:3003
- **Media Service**: http://localhost:3004
- **RabbitMQ Management**: http://localhost:15672 (admin/password123)

### Documentación Swagger

- Auth Service: http://localhost:3001/api/docs
- Subscriptions Service: http://localhost:3002/api/docs
- Billing Service: http://localhost:3003/api/docs
- Media Service: http://localhost:3004/api/docs

## Patrones de Diseño Implementados

### Repository Pattern
- Abstracción del acceso a datos en cada microservicio
- Separación entre lógica de negocio y persistencia

### Strategy Pattern
- Implementado en Billing Service para diferentes tipos de descuentos
- Aplicación de puntos y promociones

### Observer/Event-driven
- Comunicación asíncrona via RabbitMQ
- Eventos: `payment.success`, `subscription.canceled`, `loyalty.pointsUpdated`

### Factory Pattern
- Creación de DTOs y entidades
- Validación y transformación de datos

## Clean Architecture

Cada microservicio sigue la estructura:

\`\`\`
src/
├── domain/           # Entidades y reglas de negocio
├── application/      # Casos de uso y servicios
├── infrastructure/   # Repositorios y adaptadores externos
└── presentation/     # Controladores y DTOs
\`\`\`

## Variables de Entorno

Configurar las siguientes variables para producción:

- `JWT_SECRET`: Clave secreta para JWT
- `STRIPE_SECRET_KEY`: Clave secreta de Stripe
- `STRIPE_WEBHOOK_SECRET`: Secret para webhooks de Stripe
- Credenciales de MongoDB y RabbitMQ

## Desarrollo

### Ejecutar un servicio individualmente

\`\`\`bash
cd auth-service
npm install
npm run start:dev
\`\`\`

### Ejecutar tests

\`\`\`bash
npm run test
npm run test:e2e
\`\`\`

## Contribución

1. Fork el proyecto
2. Crear una rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit los cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear un Pull Request
