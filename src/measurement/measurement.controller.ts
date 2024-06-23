import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { Resolution } from "../shared/enums/resolution.enum";
import { CreateMeasurementDto } from "./dto/create-measurement.dto";
import {
    GetMeasurementsParamsDto,
    GetMeasurementsQueryDto,
} from "./dto/get-measurements.dto";
import { MeasurementService } from "./measurement.service";

@Controller()
export class MeasurementController {
    constructor(private readonly measurementService: MeasurementService) {}

    /**
     * Essa é a rota que retorna as medições do dispositivo. Conforme solicitado nos requisitos,
     * ela aceita os parâmetros de data de início e fim, além da resolução da consulta.
     * Exemplo de uso: GET /api/device/mymeter-uid/measurements?resolution=hour&startDate=2022-06-01 00:15:00+00&endDate=2022-06-01 01:45:00+00
     *
     * @param deviceId id do dispositivo
     * @query startDate data de início
     * @query endDate data de início
     * @query resolution resolução da consulta, pode ser 'day', 'hour' ou 'raw'
     * @returns medições do dispositivo
     */
    @Get("device/:deviceId/measurements")
    findMeasurements(
        @Param() params: GetMeasurementsParamsDto,
        @Query() query: GetMeasurementsQueryDto
    ) {
        return this.measurementService.getMeasurements({
            startDate: query.startDate,
            endDate: query.endDate,
            resolution: query.resolution ?? Resolution.DAY,
            idDispositivo: params.deviceId,
        });
    }

    /**
     * Essa é a rota que salva as medições do dispositivo.
     * Essa rota aceita um array de medições a serem salvas.
     * Exemplo de uso: POST /api/device/mymeter-uid/measurements
     *
     * @param measurement medições a serem salvas
     * @returns medições salvas
     */
    @Post("measurements")
    saveMeasurement(@Body() measurements: CreateMeasurementDto[]) {
        return this.measurementService.saveMeasurements(measurements);
    }
}
