import appInsights from "applicationinsights";

// --- Application Insights (Bun / Node-compatible) ---
appInsights
  .setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING)
  .setAutoDependencyCorrelation(true)
  .setAutoCollectRequests(true)
  .setAutoCollectPerformance(true, true) // ← segundo argumento agregado
  .setAutoCollectExceptions(true)
  .setAutoCollectDependencies(true)
  .setAutoCollectConsole(true, true)
  .setUseDiskRetryCaching(true)
  .start();

const client = appInsights.defaultClient;
client.context.tags[client.context.keys.cloudRole] = "pds006-bun-api";
client.trackEvent({ name: "server_started", properties: { environment: "production" } });

console.log("✅ Application Insights inicializado");

// --- Resto de tu aplicación ---
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

// Usa el puerto que Azure inyecta en la variable de entorno PORT
const PORT = Number(process.env.PORT) || 3000;

app.run;

