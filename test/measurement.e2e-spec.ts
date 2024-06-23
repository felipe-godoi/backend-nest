import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule, getRepositoryToken } from "@nestjs/typeorm";
import * as request from "supertest";
import { MeasurementModule } from "../src/measurement/measurement.module";
import { MeasurementRepository } from "../src/shared/repositories/measurement.repository";
import { configService } from "../src/shared/services/config.service";

describe("MeasurementController (e2e)", () => {
    let app: INestApplication;
    let measurementRepository: MeasurementRepository;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                MeasurementModule,
                TypeOrmModule.forRoot(configService.getTypeOrmTestConfig()),
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ transform: true }));
        await app.init();

        measurementRepository = app.get(
            getRepositoryToken(MeasurementRepository)
        );
    });

    afterAll(async () => {
        await app.close();
    });

    afterEach(async () => {
        await measurementRepository.query("DELETE FROM measurement");
    });

    it("/measurements (POST)", async () => {
        const measurements = [
            {
                idDispositivo: "test-device-id",
                timestamp: "2024-01-01 00:00:00+00",
                activeEnergy: 10,
                activePower: 10,
            },
        ];

        const saved = await request(app.getHttpServer())
            .post("/measurements")
            .send(measurements)
            .expect(201);

        expect(saved.body).toEqual([
            {
                id: expect.any(Number),
                idDispositivo: "test-device-id",
                timestamp: "2024-01-01 00:00:00+00",
                activeEnergy: 10,
                activePower: 10,
            },
        ]);
    });

    describe("/device/:deviceId/measurements (GET)", () => {
        const deviceId = "test-device-id";

        it("should return empty array when database is empty", async () => {
            const result = await request(app.getHttpServer())
                .get("/device/test-device-id/measurements")
                .query({
                    startDate: "2024-01-01 00:00:00+00",
                    endDate: "2024-01-02 11:00:00+00",
                })
                .expect(200);

            expect(result.body).toStrictEqual({ measurements: [] });
        });

        describe("test cases for aggregation", () => {
            describe("resolution: day", () => {
                it("should aggregate by day correctly when resolution is not passed", async () => {
                    const measurements = [
                        {
                            idDispositivo: "test-device-id",
                            timestamp: "2024-01-01 00:00:00+00",
                            activeEnergy: 1,
                            activePower: 1,
                        },
                        {
                            idDispositivo: "test-device-id",
                            timestamp: "2024-01-01 00:30:00+00",
                            activeEnergy: 1,
                            activePower: 1,
                        },
                        {
                            idDispositivo: "test-device-id",
                            timestamp: "2024-01-01 01:00:00+00",
                            activeEnergy: 2,
                            activePower: 2,
                        },
                        {
                            idDispositivo: "test-device-id",
                            timestamp: "2024-01-02 00:00:00+00",
                            activeEnergy: 3,
                            activePower: 3,
                        },
                        {
                            idDispositivo: "test-device-id",
                            timestamp: "2024-01-02 10:00:00+00",
                            activeEnergy: 3,
                            activePower: 3,
                        },
                        {
                            idDispositivo: "test-device-id",
                            timestamp: "2024-01-02 10:50:00+00",
                            activeEnergy: 4,
                            activePower: 4,
                        },
                        {
                            idDispositivo: "test-device-id2",
                            timestamp: "2024-01-01 00:00:00+00",
                            activeEnergy: 100,
                            activePower: 100,
                        },
                    ];

                    await request(app.getHttpServer())
                        .post("/measurements")
                        .send(measurements)
                        .expect(201);

                    const expectedResult = {
                        measurements: [
                            {
                                date: "2024-01-01T00:00:00.000Z",
                                accumulatedEnergy: 4,
                                accumulatedPower: 4,
                            },
                            {
                                date: "2024-01-02T00:00:00.000Z",
                                accumulatedEnergy: 10,
                                accumulatedPower: 10,
                            },
                        ],
                    };
                    const result = await request(app.getHttpServer())
                        .get("/device/test-device-id/measurements")
                        .query({
                            startDate: "2024-01-01 00:00:00+00",
                            endDate: "2024-01-02 11:00:00+00",
                        })
                        .expect(200);

                    expect(result.body).toStrictEqual(expectedResult);
                });

                it("should aggregate by day correctly when resolution is 'day'", async () => {
                    const measurements = [
                        {
                            idDispositivo: "test-device-id",
                            timestamp: "2024-01-01 00:00:00+00",
                            activeEnergy: 1,
                            activePower: 1,
                        },
                        {
                            idDispositivo: "test-device-id",
                            timestamp: "2024-01-01 00:30:00+00",
                            activeEnergy: 1,
                            activePower: 1,
                        },
                        {
                            idDispositivo: "test-device-id",
                            timestamp: "2024-01-01 01:00:00+00",
                            activeEnergy: 2,
                            activePower: 2,
                        },
                        {
                            idDispositivo: "test-device-id",
                            timestamp: "2024-01-02 00:00:00+00",
                            activeEnergy: 3,
                            activePower: 3,
                        },
                        {
                            idDispositivo: "test-device-id",
                            timestamp: "2024-01-02 10:00:00+00",
                            activeEnergy: 3,
                            activePower: 3,
                        },
                        {
                            idDispositivo: "test-device-id",
                            timestamp: "2024-01-02 10:50:00+00",
                            activeEnergy: 4,
                            activePower: 4,
                        },
                        {
                            idDispositivo: "test-device-id2",
                            timestamp: "2024-01-01 00:00:00+00",
                            activeEnergy: 100,
                            activePower: 100,
                        },
                    ];

                    await request(app.getHttpServer())
                        .post("/measurements")
                        .send(measurements)
                        .expect(201);

                    const expectedResult = {
                        measurements: [
                            {
                                date: "2024-01-01T00:00:00.000Z",
                                accumulatedEnergy: 4,
                                accumulatedPower: 4,
                            },
                            {
                                date: "2024-01-02T00:00:00.000Z",
                                accumulatedEnergy: 10,
                                accumulatedPower: 10,
                            },
                        ],
                    };
                    const result = await request(app.getHttpServer())
                        .get("/device/test-device-id/measurements")
                        .query({
                            startDate: "2024-01-01 00:00:00+00",
                            endDate: "2024-01-02 11:00:00+00",
                            resolution: "day",
                        })
                        .expect(200);

                    expect(result.body).toStrictEqual(expectedResult);
                });

                it("should aggregate by day considering startDate and endDate correctly when resolution is 'day'", async () => {
                    const measurements = [
                        {
                            idDispositivo: "test-device-id",
                            timestamp: "2024-01-01 00:00:00+00",
                            activeEnergy: 1,
                            activePower: 1,
                        },
                        {
                            idDispositivo: "test-device-id",
                            timestamp: "2024-01-01 00:30:00+00",
                            activeEnergy: 1,
                            activePower: 1,
                        },
                        {
                            idDispositivo: "test-device-id",
                            timestamp: "2024-01-01 01:00:00+00",
                            activeEnergy: 2,
                            activePower: 2,
                        },
                        {
                            idDispositivo: "test-device-id",
                            timestamp: "2024-01-02 00:00:00+00",
                            activeEnergy: 3,
                            activePower: 3,
                        },
                        {
                            idDispositivo: "test-device-id",
                            timestamp: "2024-01-02 10:00:00+00",
                            activeEnergy: 3,
                            activePower: 3,
                        },
                        {
                            idDispositivo: "test-device-id",
                            timestamp: "2024-01-02 10:50:00+00",
                            activeEnergy: 4,
                            activePower: 4,
                        },
                        {
                            idDispositivo: "test-device-id2",
                            timestamp: "2024-01-01 00:00:00+00",
                            activeEnergy: 100,
                            activePower: 100,
                        },
                    ];

                    await request(app.getHttpServer())
                        .post("/measurements")
                        .send(measurements)
                        .expect(201);

                    const expectedResult = {
                        measurements: [
                            {
                                date: "2024-01-01T00:00:00.000Z",
                                accumulatedEnergy: 3,
                                accumulatedPower: 3,
                            },
                            {
                                date: "2024-01-02T00:00:00.000Z",
                                accumulatedEnergy: 6,
                                accumulatedPower: 6,
                            },
                        ],
                    };
                    const result = await request(app.getHttpServer())
                        .get("/device/test-device-id/measurements")
                        .query({
                            startDate: "2024-01-01 00:30:00+00",
                            endDate: "2024-01-02 10:00:00+00",
                            resolution: "day",
                        })
                        .expect(200);

                    expect(result.body).toStrictEqual(expectedResult);
                });
            });

            describe("resolution: hour", () => {
                it("should aggregate by day correctly when resolution is 'hour'", async () => {
                    const measurements = [
                        {
                            idDispositivo: "test-device-id",
                            timestamp: "2024-01-01 00:00:00+00",
                            activeEnergy: 1,
                            activePower: 1,
                        },
                        {
                            idDispositivo: "test-device-id",
                            timestamp: "2024-01-01 00:30:00+00",
                            activeEnergy: 8,
                            activePower: 8,
                        },
                        {
                            idDispositivo: "test-device-id",
                            timestamp: "2024-01-01 01:00:00+00",
                            activeEnergy: 2,
                            activePower: 2,
                        },
                        {
                            idDispositivo: "test-device-id",
                            timestamp: "2024-01-01 01:10:00+00",
                            activeEnergy: 3,
                            activePower: 3,
                        },
                        {
                            idDispositivo: "test-device-id",
                            timestamp: "2024-01-01 01:25:00+00",
                            activeEnergy: 3,
                            activePower: 3,
                        },
                        {
                            idDispositivo: "test-device-id",
                            timestamp: "2024-01-01 05:50:00+00",
                            activeEnergy: 4,
                            activePower: 4,
                        },
                        {
                            idDispositivo: "test-device-id",
                            timestamp: "2024-01-01 05:57:00+00",
                            activeEnergy: 3,
                            activePower: 3,
                        },
                        {
                            idDispositivo: "test-device-id2",
                            timestamp: "2024-01-01 00:00:00+00",
                            activeEnergy: 100,
                            activePower: 100,
                        },
                    ];

                    await request(app.getHttpServer())
                        .post("/measurements")
                        .send(measurements)
                        .expect(201);

                    const expectedResult = {
                        measurements: [
                            {
                                date: "2024-01-01 00:00:00",
                                accumulatedEnergy: 9,
                                accumulatedPower: 9,
                            },
                            {
                                date: "2024-01-01 01:00:00",
                                accumulatedEnergy: 8,
                                accumulatedPower: 8,
                            },
                            {
                                date: "2024-01-01 05:00:00",
                                accumulatedEnergy: 7,
                                accumulatedPower: 7,
                            },
                        ],
                    };
                    const result = await request(app.getHttpServer())
                        .get("/device/test-device-id/measurements")
                        .query({
                            startDate: "2024-01-01 00:00:00+00",
                            endDate: "2024-01-02 11:00:00+00",
                            resolution: "hour",
                        })
                        .expect(200);

                    expect(result.body).toStrictEqual(expectedResult);
                });

                it("should aggregate by day considering startDate and endDate correctly when resolution is 'hour'", async () => {
                    const measurements = [
                        {
                            idDispositivo: "test-device-id",
                            timestamp: "2024-01-01 00:00:00+00",
                            activeEnergy: 1,
                            activePower: 1,
                        },
                        {
                            idDispositivo: "test-device-id",
                            timestamp: "2024-01-01 00:30:00+00",
                            activeEnergy: 8,
                            activePower: 8,
                        },
                        {
                            idDispositivo: "test-device-id",
                            timestamp: "2024-01-01 01:00:00+00",
                            activeEnergy: 2,
                            activePower: 2,
                        },
                        {
                            idDispositivo: "test-device-id",
                            timestamp: "2024-01-01 01:10:00+00",
                            activeEnergy: 3,
                            activePower: 3,
                        },
                        {
                            idDispositivo: "test-device-id",
                            timestamp: "2024-01-01 01:25:00+00",
                            activeEnergy: 3,
                            activePower: 3,
                        },
                        {
                            idDispositivo: "test-device-id",
                            timestamp: "2024-01-01 05:50:00+00",
                            activeEnergy: 4,
                            activePower: 4,
                        },
                        {
                            idDispositivo: "test-device-id",
                            timestamp: "2024-01-01 05:57:00+00",
                            activeEnergy: 3,
                            activePower: 3,
                        },
                        {
                            idDispositivo: "test-device-id2",
                            timestamp: "2024-01-01 00:00:00+00",
                            activeEnergy: 100,
                            activePower: 100,
                        },
                    ];

                    await request(app.getHttpServer())
                        .post("/measurements")
                        .send(measurements)
                        .expect(201);

                    const expectedResult = {
                        measurements: [
                            {
                                date: "2024-01-01 00:00:00",
                                accumulatedEnergy: 8,
                                accumulatedPower: 8,
                            },
                            {
                                date: "2024-01-01 01:00:00",
                                accumulatedEnergy: 8,
                                accumulatedPower: 8,
                            },
                            {
                                date: "2024-01-01 05:00:00",
                                accumulatedEnergy: 4,
                                accumulatedPower: 4,
                            },
                        ],
                    };
                    const result = await request(app.getHttpServer())
                        .get("/device/test-device-id/measurements")
                        .query({
                            startDate: "2024-01-01 00:30:00+00",
                            endDate: "2024-01-01 05:55:00+00",
                            resolution: "hour",
                        })
                        .expect(200);

                    expect(result.body).toStrictEqual(expectedResult);
                });
            });

            describe("resolution: raw", () => {
                it("should aggregate by day correctly when resolution is 'hour'", async () => {
                    const measurements = [
                        {
                            idDispositivo: "test-device-id",
                            timestamp: "2024-01-01 00:00:00+00",
                            activeEnergy: 1,
                            activePower: 1,
                        },
                        {
                            idDispositivo: "test-device-id",
                            timestamp: "2024-01-01 00:30:00+00",
                            activeEnergy: 8,
                            activePower: 8,
                        },
                        {
                            idDispositivo: "test-device-id",
                            timestamp: "2024-01-01 01:00:00+00",
                            activeEnergy: 2,
                            activePower: 2,
                        },
                        {
                            idDispositivo: "test-device-id2",
                            timestamp: "2024-01-01 00:00:00+00",
                            activeEnergy: 100,
                            activePower: 100,
                        },
                    ];

                    await request(app.getHttpServer())
                        .post("/measurements")
                        .send(measurements)
                        .expect(201);

                    const expectedResult = {
                        measurements: [
                            {
                                date: "2024-01-01T00:00:00.000Z",
                                activeEnergy: 1,
                                activePower: 1,
                            },
                            {
                                date: "2024-01-01T00:30:00.000Z",
                                activeEnergy: 8,
                                activePower: 8,
                            },
                            {
                                date: "2024-01-01T01:00:00.000Z",
                                activeEnergy: 2,
                                activePower: 2,
                            },
                        ],
                    };
                    const result = await request(app.getHttpServer())
                        .get("/device/test-device-id/measurements")
                        .query({
                            startDate: "2024-01-01 00:00:00+00",
                            endDate: "2024-01-02 11:00:00+00",
                            resolution: "raw",
                        })
                        .expect(200);

                    expect(result.body).toStrictEqual(expectedResult);
                });

                it("should aggregate by day considering startDate and endDate correctly when resolution is 'hour'", async () => {
                    const measurements = [
                        {
                            idDispositivo: "test-device-id",
                            timestamp: "2024-01-01 00:00:00+00",
                            activeEnergy: 1,
                            activePower: 1,
                        },
                        {
                            idDispositivo: "test-device-id",
                            timestamp: "2024-01-01 00:30:00+00",
                            activeEnergy: 8,
                            activePower: 8,
                        },
                        {
                            idDispositivo: "test-device-id",
                            timestamp: "2024-01-01 01:00:00+00",
                            activeEnergy: 2,
                            activePower: 2,
                        },
                        {
                            idDispositivo: "test-device-id2",
                            timestamp: "2024-01-01 00:00:00+00",
                            activeEnergy: 100,
                            activePower: 100,
                        },
                    ];

                    await request(app.getHttpServer())
                        .post("/measurements")
                        .send(measurements)
                        .expect(201);

                    const expectedResult = {
                        measurements: [
                            {
                                date: "2024-01-01T00:30:00.000Z",
                                activeEnergy: 8,
                                activePower: 8,
                            },
                        ],
                    };
                    const result = await request(app.getHttpServer())
                        .get("/device/test-device-id/measurements")
                        .query({
                            startDate: "2024-01-01 00:20:00+00",
                            endDate: "2024-01-01 00:50:00+00",
                            resolution: "raw",
                        })
                        .expect(200);

                    expect(result.body).toStrictEqual(expectedResult);
                });
            });
        });
    });
});
