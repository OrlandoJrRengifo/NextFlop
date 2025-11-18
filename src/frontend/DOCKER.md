# NextFlop - Configuración Docker

Este proyecto está completamente dockerizado para facilitar el despliegue y desarrollo.

## Requisitos previos

- Docker instalado (versión 20.x o superior)
- Docker Compose instalado (versión 2.x o superior)

## Comandos rápidos

### Levantar la aplicación

\`\`\`bash
docker-compose up -d
\`\`\`

La aplicación estará disponible en: `http://localhost:3000`

### Detener la aplicación

\`\`\`bash
docker-compose down
\`\`\`

### Ver logs

\`\`\`bash
docker-compose logs -f nextflop
\`\`\`

### Reconstruir la imagen

\`\`\`bash
docker-compose up --build -d
\`\`\`

## Desarrollo

Para desarrollo local sin Docker, puedes usar:

\`\`\`bash
npm install
npm run dev
\`\`\`

## Producción

El Dockerfile está optimizado para producción con:
- Build multi-stage para reducir el tamaño de la imagen
- Usuario no-root para seguridad
- Optimizaciones de Next.js standalone
- Cache de capas de Docker

## Variables de entorno

Puedes agregar variables de entorno en el archivo `docker-compose.yaml` en la sección `environment` o crear un archivo `.env` en la raíz del proyecto.

## Solución de problemas

### Puerto 3000 ya en uso

Si el puerto 3000 ya está en uso, puedes cambiar el mapeo de puertos en `docker-compose.yaml`:

\`\`\`yaml
ports:
  - "8080:3000"  # Usar puerto 8080 en lugar de 3000
\`\`\`

### Permisos de archivos

Si tienes problemas con permisos, asegúrate de que los archivos no estén siendo creados con permisos restrictivos.

## Arquitectura

La aplicación usa:
- Next.js 16 con App Router
- TypeScript
- TailwindCSS v4
- Shadcn UI components
- Modo oscuro por defecto
