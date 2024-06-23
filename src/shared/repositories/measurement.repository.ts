import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Measurement } from "../entities/measurement.entity";

export interface MeasurementOutput {
    measurements: {
        date: string;
        accumulatedEnergy?: number;
        accumulatedPower?: number;
        activeEnergy?: number;
        activePower?: number;
    }[];
}

interface FindMeasurementParams {
    idDispositivo: string;
    startDate: string;
    endDate: string;
}

@Injectable()
export class MeasurementRepository extends Repository<Measurement> {
    constructor(private dataSource: DataSource) {
        super(Measurement, dataSource.createEntityManager());
    }

    async findByDay({
        idDispositivo,
        startDate,
        endDate,
    }: FindMeasurementParams): Promise<MeasurementOutput> {
        const measurements = await this.createQueryBuilder("measurement")
            .select("DATE(measurement.timestamp)", "date")
            .addSelect("SUM(measurement.activeEnergy)", "accumulatedEnergy")
            .addSelect("SUM(measurement.activePower)", "accumulatedPower")
            .groupBy("DATE(measurement.timestamp)")
            .where("measurement.timestamp BETWEEN :startDate AND :endDate", {
                startDate,
                endDate,
            })
            .andWhere("measurement.idDispositivo = :idDispositivo", {
                idDispositivo,
            })
            .getRawMany();

        return {
            measurements: measurements.map((m) => ({
                date: m.date,
                accumulatedEnergy: Number(m.accumulatedEnergy),
                accumulatedPower: Number(m.accumulatedPower),
            })),
        };
    }

    async findByHour({
        idDispositivo,
        startDate,
        endDate,
    }: FindMeasurementParams): Promise<MeasurementOutput> {
        const measurements = await this.createQueryBuilder("measurement")
            .select(
                "DATE_FORMAT(measurement.timestamp, '%Y-%m-%d %H:00:00')",
                "date"
            )
            .addSelect("SUM(measurement.activeEnergy)", "accumulatedEnergy")
            .addSelect("SUM(measurement.activePower)", "accumulatedPower")
            .groupBy("DATE_FORMAT(measurement.timestamp, '%Y-%m-%d %H:00:00')")
            .where("measurement.timestamp BETWEEN :startDate AND :endDate", {
                startDate,
                endDate,
            })
            .andWhere("measurement.idDispositivo = :idDispositivo", {
                idDispositivo,
            })
            .getRawMany();

        return {
            measurements: measurements.map((m) => ({
                date: m.date,
                accumulatedEnergy: m.accumulatedEnergy,
                accumulatedPower: m.accumulatedPower,
            })),
        };
    }

    async findRaw({
        idDispositivo,
        startDate,
        endDate,
    }: FindMeasurementParams): Promise<MeasurementOutput> {
        const measurements = await this.createQueryBuilder("measurement")
            .select("measurement.timestamp", "date")
            .addSelect("measurement.activeEnergy", "activeEnergy")
            .addSelect("measurement.activePower", "activePower")
            .where("measurement.timestamp BETWEEN :startDate AND :endDate", {
                startDate,
                endDate,
            })
            .andWhere("measurement.idDispositivo = :idDispositivo", {
                idDispositivo,
            })
            .getRawMany();

        return {
            measurements: measurements.map((m) => ({
                date: m.date,
                activeEnergy: m.activeEnergy,
                activePower: m.activePower,
            })),
        };
    }
}
