# NextFlop — Dev quickstart (microservices + frontend)

Este repo contiene un ejemplo completo de microservicios (NestJS) + frontend (Next.js) integrados mediante un API Gateway (Kong). Objetivo: que el frontend consuma únicamente el API Gateway y NO use datos mock. Todo puede levantarse con Docker Compose.

---

## Requisitos

- Docker (Engine)
- Docker Compose v2 (incluido en Docker Desktop / docker-compose)
- Node 18+ (para ejecutar frontend localmente si prefieres)

---

## Entorno por servicio (ejemplos)

frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

auth-service (`src/microservices/auth-service/.env`) — ejemplo (usado localmente dentro del contenedor):

```
MONGODB_URI="mongodb://admin:password123@mongodb-auth:27017/nextflop_auth?authSource=admin"
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=3000
```

subscriptions-service (`src/microservices/subscriptions-service/.env`):

```
MONGODB_URI="mongodb://admin:password123@mongodb-subscriptions:27017/nextflop_subscriptions?authSource=admin"
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=3000
```

billing-service (`src/microservices/billing-service/.env`):

```
DATABASE_URL="mongodb://admin:password123@mongodb-billing:27017/nextflop_billing?authSource=admin"
JWT_SECRET=your-super-secret-jwt-key-change-in-production
STRIPE_SECRET_KEY=sk_test_... (tú puedes reemplazarlo con tu clave de stripe test)
STRIPE_WEBHOOK_SECRET=whsec_...
PORT=3000
```

media-service (`src/microservices/media-service/.env`):

```
DATABASE_URL="mongodb://admin:password123@mongodb-media:27017/nextflop_media?authSource=admin"
PORT=3000
```

> Nota: en `docker-compose.yml` los contenedores ya están configurados para usar los hostnames de los servicios (mongodb-auth, mongodb-billing, kong, etc.). El frontend dentro del contenedor se conecta al gateway Kong con `http://kong:8000`. Si ejecutas el frontend en tu máquina local, asegúrate de tener `NEXT_PUBLIC_API_URL` apuntando a `http://localhost:8000`.

---

## Levantar todo (Docker)

Desde la raíz del repo:

```bash
docker compose up --build -d
```

Esto levantará:

- MongoDB (4 instancias por servicio)
- Auth service (NestJS)
- Subscriptions service (NestJS)
- Billing service (NestJS)
- Media service (NestJS)
- Kong API Gateway (puerto 8000)
- Frontend (Next.js)

Puntos clave:
- Frontend consumirá la API a través de Kong en `http://localhost:8000`
- Swagger docs disponibles en cada servicio en su puerto (ej: http://localhost:3001/api/docs para Auth), pero vía Kong podrían mapearse también (según `kong.yml`)

---

## Rutas / endpoints útiles (smoke tests)

- Registrar usuario (Auth):

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com", "password":"password123", "name": "Test User"}'
```

- Login (Auth):

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

- Obtener catálogo (Media):

```bash
curl http://localhost:8000/api/media?limit=10
```

- Populares:

```bash
curl http://localhost:8000/api/media/popular?limit=10
```

- Nuevo lanzamiento:

```bash
curl http://localhost:8000/api/media/new-releases?limit=10
```

- Subscriptions (planes):

```bash
curl http://localhost:8000/api/subscriptions/plans
```

- Historial / Watchlist / Favoritos — requieren JWT Authorization (Authorization: Bearer <token>)

---

## Qué he implementado/ajustado hasta ahora ✅

- Unifiqué rutas de controllers (todos usan `api/...`) para que Kong funcione correctamente sin convertir paths.
- Añadí `api` endpoints faltantes en el Media service (popular, new-releases, recommended) y los correspondientes use-cases.
- Cambié el frontend para que consuma datos reales desde el API Gateway (sin mocks) en páginas clave: Home, Movies, Shows, Genres, Search, Watch Later, Profile edit.
- Ajusté docker-compose para que el frontend dentro del contenedor apunte a Kong (`http://kong:8000`) y añadí `.env` ejemplos a cada microservicio.

---

## Próximos pasos sugeridos

- Completar la eliminación de cualquier mock restante en el frontend (en especial en páginas menos críticas) — ya cubrí muchas vistas principales.
- Añadir un script de `smoke tests` que valide el flujo completo (registro → login → crear perfil → suscripción → pago test via Stripe)
- Añadir `seed` data para el catálogo de `media-service` si deseas poblar inicialmente MongoDB con títulos reales.

---

Si quieres, puedo ahora:

- Añadir más endpoints/funcionalidad faltante (webhooks de Stripe en billing, más endpoints de administración, cuentas demo, etc.)
- Crear un script de pruebas/smoke-tests que se ejecute al levantar `docker compose up` para validar salud de servicios.

¿Deseas que haga alguna de esas acciones ahora? (por ejemplo: generar scripts de pruebas + seeding de media).