PDS006-DevOps-2025

API REST para gestión de dispositivos tecnológicos y equipos biomédicos, desarrollada con **TypeScript**, **Bun runtime**, **Elysia.js**, arquitectura **hexagonal**, telemetría con **Azure Monitor**, soporte para fotos y despliegue automatizado en Azure.

🔗 **Despliegue en Azure App Service:**
[https://serviceidevops.azurewebsites.net/openapi](https://serviceidevops.azurewebsites.net/openapi)

---

# 📘 Descripción General

El proyecto pds006-DevOps-2025** es un sistema de control de ingreso de equipos tecnológicos y biomédicos que permite:

* Registrar **check-in** y **check-out** de computadoras y equipos médicos.
* Almacenar fotos de los dispositivos.
* Registrar dispositivos frecuentes.
* Consultar equipos ingresados, frecuentes y en sistema.

El sistema implementa:

* **Arquitectura Hexagonal (Ports & Adapters)**.
* **Bun** como runtime ultrarrápido.
* **Elysia.js** como framework HTTP.
* **OpenTelemetry + Azure Monitor** para observabilidad.
* **CI/CD en Azure** con contenedores Docker.

---

# 🛠️ Tecnologías y Librerías Utilizadas

| Categoría               | Librerías                                                                                                                                               |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Runtime & Web**       | bun-types, Elysia, @elysiajs/openapi                                                                                                                    |
| **Telemetría**          | @azure/monitor-opentelemetry-exporter, @elysiajs/opentelemetry, @opentelemetry/sdk-node, @opentelemetry/auto-instrumentations-node, applicationinsights |
| **Base de Datos / ORM** | drizzle-orm, drizzle-kit (aún no implementado en código)                                                                                                |
| **Autenticación**       | better-auth                                                                                                                                             |
| **Validación**          | zod                                                                                                                                                     |
| **Desarrollo**          | typescript                                                                                                                                              |

---

# 📁 Estructura del Proyecto

```
.pds006-DevOps-2025/
├── .devcontainer/
│   ├── Dockerfile
│   └── devcontainer.json
├── .github/workflows/
│   ├── azure.yml        # CI/CD a Azure
│   └── main.yml         # Build y test del contenedor
├── src/
│   ├── adapter/         # Adaptadores (hexágono exterior)
│   │   ├── api/elysia/
│   │   │   ├── controller.elysia.ts
│   │   │   ├── elysia.api.ts
│   │   │   ├── criteria.helper.ts
│   │   │   └── index.ts
│   │   ├── photo/filesystem/
│   │   │   ├── filesystem.photo-repository.ts
│   │   │   └── index.ts
│   │   └── repository/inmemory/
│   │       ├── inmemory.device-repository.ts
│   │       ├── inmemory.device-repository.test.ts
│   │       └── index.ts
│   ├── core/            # Capa de negocio (hexágono interior)
│   │   ├── domain/
│   │   ├── dto/
│   │   ├── repository/
│   │   └── service/
│   │       └── helper.ts
│   ├── index.ts         # Punto de entrada
│   ├── index.test.ts
│   └── telemetry.ts     # Configuración OpenTelemetry
├── public/              # Fotos almacenadas
├── Dockerfile
├── README.md
├── architecture.md
├── package.json
└── tsconfig.json
```

---

# 🧩 Explicación de Carpetas (Arquitectura Hexagonal)

## 🔹 adapter/api/elysia/ — *Equivalente a controllers*

Maneja peticiones HTTP, validación y delegación a servicios del core.
Incluye:

* **controller.elysia.ts** – Define rutas y manejo HTTP.
* **elysia.api.ts** – Configura servidor, OpenAPI y telemetría.
* **criteria.helper.ts** – Parseo de filtros, paginación y ordenamiento.

Usa: `elysia`, `zod`, `@elysiajs/opentelemetry`.

## 🔹 core/service/ — *Lógica de negocio*

Implementa reglas para:

* Check-in
* Check-out
* Generación de IDs
* Construcción de URLs

Independiente de infraestructura.

## 🔹 adapter/repository/inmemory/ — *Persistencia en memoria*

Implementa interfaces del core usando `Map`.

Características:

* Filtrado, ordenamiento y paginación.
* Implementación intercambiable.

## 🔹 core/domain/ — *Modelos de dominio*

Entidades puras: `Computer`, `MedicalDevice`, `FrequentComputer`, etc.

## 🔹 adapter/photo/filesystem/ — *Servidor de fotos*

Guarda fotos en `./public/` y las sirve en un servidor Bun en puerto 8080.

---

# ⚙️ Configuración del Entorno

## Telemetría

Variables opcionales:

```
APPLICATIONINSIGHTS_CONNECTION_STRING=...
AXIOM_TOKEN=...
AXIOM_DATASET=...
MEDIA_PORT=8080
```

## Puertos del sistema

| Servicio          | Puerto | Origen                         |
| ----------------- | ------ | ------------------------------ |
| API Elysia        | 3000   | elysia.api.ts                  |
| Servidor de fotos | 8080   | filesystem.photo-repository.ts |

---

# ▶️ Cómo Ejecutar el Proyecto

## 1. Clonar

```
git clone https://github.com/NicVar1/pds006-DevOps-2025.git
cd pds006-DevOps-2025
```

## 2. Instalar Bun

```
curl -fsSL https://bun.sh/install | bash
```

## 3. Instalar dependencias

```
bun install
```

## 4. Variables de entorno (opcional)

Crear `.env` si se desea telemetría.

## 5. Ejecutar

```
bun run start
```

---

# 🌐 Endpoints Disponibles

Todos bajo: **/api**

## 🟦 Check-in

### POST /api/computers/checkin

Registra una computadora.

### POST /api/medicaldevices/checkin

Registra un equipo médico.

### PATCH /api/computers/frequent/checkin/:id

Check-in rápido para dispositivo frecuente.

## 🟨 Registro de Frecuentes

### POST /api/computers/frequent

Registra una computadora como frecuente.

## 🟥 Check-out

### PATCH /api/devices/checkout/:id

Marca salida del dispositivo.

## 🟩 Consultas

### GET /api/computers

### GET /api/medicaldevices

### GET /api/computers/frequent

### GET /api/devices/entered

Todos soportan:

* `filter[campo]=valor`
* `sort=campo` / `sort=-campo`
* `limit=N`
* `offset=N`

---

# 🧭 Diagrama UML (Vista General)

```
        +---------------------+
        |     API (Elysia)    |
        +---------+-----------+
                  |
                  v
        +---------------------+
        |     Servicios       |
        |   (Core Service)    |
        +---------------------+
                  |
     +------------+-------------+
     |                          |
     v                          v
+-----------+         +-------------------+
|Repositorio|         |Repositorio Fotos  |
|  InMemory |         | FileSystem        |
+-----------+         +-------------------+
```

---

# 🐳 Despliegue en Contenedores Docker

```
docker build -t pds006-devops .
docker run -p 3000:3000 -p 8080:8080 pds006-devops
```

---

# 🚀 CI/CD en Azure

Incluye workflows automáticos:

* Build y test del contenedor.
* Push al Azure Container Registry.
* Deploy automático al Azure App Service.

Secretos usados:

* `ACR_NAME_ANDRES`
* `ACR_PASSWORD_ANDRES`
* `AZURE_WEBAPP_PUBLISH_PROFILE_ANDRES`

---
