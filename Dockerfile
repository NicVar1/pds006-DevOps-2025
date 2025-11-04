# Imagen base oficial de Bun
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# Copiar archivos de dependencias
COPY bun.lock package.json ./

# Instalar dependencias de producción
RUN bun install --frozen-lockfile --production

# Copiar el resto del proyecto
COPY . .

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Exponer puerto
EXPOSE 3000

# Comando de ejecución
CMD ["bun", "run", "start"]
