import { ComputerService, DeviceService, MedicalDeviceService } from "@/core/service";
import { Controller } from "./controller.elysia";

import openapi from "@elysiajs/openapi";
import { Elysia } from "elysia"; // <- importante, con llaves

import { opentelemetry } from "@elysiajs/opentelemetry";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";

export class ElysiaApiAdapter {
    private controller: Controller;
    public app: Elysia;

    constructor(
        computerService: ComputerService,
        deviceService: DeviceService,
        medicalDeviceService: MedicalDeviceService
    ) {
        this.controller = new Controller(
            computerService,
            deviceService,
            medicalDeviceService
        );

        this.app = new Elysia()
           
            .use(
                opentelemetry({
                    spanProcessors: [
                        new BatchSpanProcessor(
                            new OTLPTraceExporter({
                                url: "https://api.axiom.co/v1/traces",
                                headers: {
                                    Authorization: `Bearer ${Bun.env.AXIOM_TOKEN}`,
                                    "X-Axiom-Dataset": Bun.env.AXIOM_DATASET ?? ""
                                }
                            })
                        )
                    ]
                })
            )
            
            .use(openapi({}))
            .use(this.controller.routes());
    }

    async run() {
        this.app.listen(3000);
        console.log("Servidor corriendo en el puerto 3000 con telemetría habilitada");
    }
}