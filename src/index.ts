import appInsights from "applicationinsights";

// Solo inicializa Application Insights si la conexión existe y si el runtime es Node
if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING && process.release?.name === "node") {
  appInsights
    .setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING)
    .setAutoDependencyCorrelation(true)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true, true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectConsole(true, true)
    .setUseDiskRetryCaching(true)
    .start();

  const client = appInsights.defaultClient;
  client.context.tags[client.context.keys.cloudRole] = "my-node-api";
  client.trackEvent({ name: "server_started", properties: { environment: "production" } });
  console.log("✅ Application Insights inicializado (modo Node)");
} else {
  console.log("⚠️ Application Insights no compatible con este runtime (Bun). Saltando inicialización.");
}


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
