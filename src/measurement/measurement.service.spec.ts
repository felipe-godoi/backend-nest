import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Resolution } from "../shared/enums/resolution.enum";
import {
    MeasurementOutput,
    MeasurementRepository,
} from "../shared/repositories/measurement.repository";
import { MeasurementService } from "./measurement.service";

const measurementsRaw: MeasurementOutput = {
    measurements: [
        { date: "2021-01-01 00:00:00", activeEnergy: 1, activePower: 1 },
        { date: "2021-01-01 00:30:00", activeEnergy: 2, activePower: 2 },
        { date: "2021-01-01 00:40:00", activeEnergy: 3, activePower: 3 },
    ],
};

const measurementsByDay: MeasurementOutput = {
    measurements: [
        {
            date: "2021-01-01 00:00:00",
            accumulatedEnergy: 1,
            accumulatedPower: 1,
        },
        {
            date: "2021-01-02 00:00:00",
            accumulatedEnergy: 2,
            accumulatedPower: 2,
        },
        {
            date: "2021-01-02 00:00:00",
            accumulatedEnergy: 3,
            accumulatedPower: 3,
        },
    ],
};

const measurementsByHour: MeasurementOutput = {
    measurements: [
        {
            date: "2021-01-01 00:00:00",
            accumulatedEnergy: 1,
            accumulatedPower: 1,
        },
        {
            date: "2021-01-01 01:00:00",
            accumulatedEnergy: 2,
            accumulatedPower: 2,
        },
        {
            date: "2021-01-01 02:00:00",
            accumulatedEnergy: 3,
            accumulatedPower: 3,
        },
    ],
};

const measurementsSaved = [
    {
        id: 1,
        idDispositivo: "my-device-id",
        timestamp: "2021-01-01 00:00:00",
        activeEnergy: 1,
        activePower: 1,
    },
];

describe("MeasurementService", () => {
    let service: MeasurementService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MeasurementService,
                {
                    provide: getRepositoryToken(MeasurementRepository),
                    useValue: {
                        findByDay: jest
                            .fn()
                            .mockResolvedValue(measurementsByDay),
                        findByHour: jest
                            .fn()
                            .mockResolvedValue(measurementsByHour),
                        findRaw: jest.fn().mockResolvedValue(measurementsRaw),
                        save: jest.fn().mockResolvedValue(measurementsSaved),
                    },
                },
            ],
        }).compile();

        service = module.get<MeasurementService>(MeasurementService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    it("should return measurements by day when resolution is 'day'", async () => {
        const repoSpy = jest.spyOn(
            service["measurementRepository"],
            "findByDay"
        );

        const result = await service.getMeasurements({
            idDispositivo: "my-device-id",
            startDate: "2022-06-01T00:15:00.000Z",
            endDate: "2022-06-01T01:45:00.000Z",
            resolution: Resolution.DAY,
        });

        expect(result).toEqual(measurementsByDay);
        expect(repoSpy).toHaveBeenCalledTimes(1);
    });

    it("should return measurements by hour when resolution is 'hour'", async () => {
        const repoSpy = jest.spyOn(
            service["measurementRepository"],
            "findByHour"
        );

        const result = await service.getMeasurements({
            idDispositivo: "my-device-id",
            startDate: "2022-06-01T00:15:00.000Z",
            endDate: "2022-06-01T01:45:00.000Z",
            resolution: Resolution.HOUR,
        });

        expect(result).toEqual(measurementsByHour);
        expect(repoSpy).toHaveBeenCalledTimes(1);
    });

    it("should return measurements witthout aggregation when resolution is 'raw'", async () => {
        const repoSpy = jest.spyOn(service["measurementRepository"], "findRaw");

        const result = await service.getMeasurements({
            idDispositivo: "my-device-id",
            startDate: "2022-06-01T00:15:00.000Z",
            endDate: "2022-06-01T01:45:00.000Z",
            resolution: Resolution.RAW,
        });

        expect(result).toEqual(measurementsRaw);
        expect(repoSpy).toHaveBeenCalledTimes(1);
    });

    it("should save measurements", async () => {
        const repoSpy = jest.spyOn(service["measurementRepository"], "save");

        const result = await service.saveMeasurements([
            {
                idDispositivo: "my-device-id",
                timestamp: "2022-06-01T00:15:00.000Z",
                activeEnergy: 1,
                activePower: 1,
            },
        ]);

        expect(result).toEqual(measurementsSaved);
        expect(repoSpy).toHaveBeenCalledTimes(1);
    });
});
