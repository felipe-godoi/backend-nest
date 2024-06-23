import { Test, TestingModule } from "@nestjs/testing";
import { Resolution } from "../shared/enums/resolution.enum";
import { MeasurementController } from "./measurement.controller";
import { MeasurementService } from "./measurement.service";

describe("MeasurementController", () => {
    let controller: MeasurementController;
    let service: MeasurementService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [MeasurementController],
            providers: [
                {
                    provide: MeasurementService,
                    useValue: {
                        getMeasurements: jest.fn(),
                        saveMeasurements: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<MeasurementController>(MeasurementController);
        service = module.get<MeasurementService>(MeasurementService);
    });

    describe("findMeasurements", () => {
        it("should return measurements according to params", async () => {
            const result = {
                measurements: [],
            };
            const params = {
                deviceId: "my-device-id",
            };
            const query = {
                startDate: "2022-06-01T00:15:00.000Z",
                endDate: "2022-06-01T01:45:00.000Z",
                resolution: Resolution.DAY,
            };

            jest.spyOn(service, "getMeasurements").mockResolvedValue(result);

            expect(await controller.findMeasurements(params, query)).toBe(
                result
            );
        });

        it("should save measurements", async () => {
            const measurements = [
                {
                    idDispositivo: "my-device-id",
                    timestamp: "2022-06-01T00:15:00.000Z",
                    activeEnergy: 10,
                    activePower: 10,
                },
            ];

            const result = [
                {
                    id: 1,
                    idDispositivo: "my-device-id",
                    timestamp: new Date("2022-06-01T00:15:00.000Z"),
                    activeEnergy: 10,
                    activePower: 10,
                },
            ];

            jest.spyOn(service, "saveMeasurements").mockResolvedValue(result);

            expect(await controller.saveMeasurement(measurements)).toBe(result);
        });
    });
});
