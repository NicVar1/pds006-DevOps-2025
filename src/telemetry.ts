import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { AzureMonitorTraceExporter } from "@azure/monitor-opentelemetry-exporter";

const connectionString = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING;

if (connectionString) {
  const exporter = new AzureMonitorTraceExporter({
    connectionString,
  });

  const sdk = new NodeSDK({
    traceExporter: exporter,
    instrumentations: [getNodeAutoInstrumentations()],
  });

  sdk.start();
  console.log("✅ OpenTelemetry + Azure Monitor inicializado correctamente");
} else {
  console.log("⚠️ No se encontró la variable APPLICATIONINSIGHTS_CONNECTION_STRING");
}
