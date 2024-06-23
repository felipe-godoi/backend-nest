import { Injectable } from "@nestjs/common";
import { Measurement } from "src/shared/entities/measurement.entity";
import { Resolution } from "../shared/enums/resolution.enum";
import {
    MeasurementOutput,
    MeasurementRepository,
} from "../shared/repositories/measurement.repository";
import { CreateMeasurementDto } from "./dto/create-measurement.dto";

interface GetMeasurementParams {
    idDispositivo: string;
    startDate: string;
    endDate: string;
    resolution: Resolution;
}

@Injectable()
export class MeasurementService {
    constructor(private measurementRepository: MeasurementRepository) {}

    async getMeasurements({
        idDispositivo,
        startDate,
        endDate,
        resolution,
    }: GetMeasurementParams): Promise<MeasurementOutput> {
        if (resolution === Resolution.DAY) {
            return await this.measurementRepository.findByDay({
                startDate,
                endDate,
                idDispositivo,
            });
        } else if (resolution === Resolution.HOUR) {
            return await this.measurementRepository.findByHour({
                startDate,
                endDate,
                idDispositivo,
            });
        } else if (resolution === Resolution.RAW) {
            return await this.measurementRepository.findRaw({
                startDate,
                endDate,
                idDispositivo,
            });
        }
    }

    async saveMeasurements(
        measurement: CreateMeasurementDto[]
    ): Promise<Measurement[]> {
        return await this.measurementRepository.save(measurement);
    }
}
