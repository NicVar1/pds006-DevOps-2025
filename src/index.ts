// Inicializa telemetría con Azure Monitor (compatible con Bun)
import "./telemetry";

import { ElysiaApiAdapter } from "./adapter/api/elysia";
import { FileSystemPhotoRepository } from "./adapter/photo/filesystem";
import { InMemoryDeviceRepository } from "./adapter/repository/inmemory";
import { ComputerService, DeviceService, MedicalDeviceService } from "./core/service";

const deviceRepository = new InMemoryDeviceRepository();
const photoRepository = new FileSystemPhotoRepository();

const computerService = new ComputerService(
  deviceRepository,
  photoRepository,
  new URL("http://localhost:3000/api")
);

const deviceService = new DeviceService(deviceRepository);

const medicalDeviceService = new MedicalDeviceService(
  deviceRepository,
  photoRepository
);

const app = new ElysiaApiAdapter(
  computerService,
  deviceService,
  medicalDeviceService
);

app.run();

console.log("🚀 Servidor iniciado correctamente con telemetría habilitada");
