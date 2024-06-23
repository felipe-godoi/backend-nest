import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Measurement } from "../shared/entities/measurement.entity";
import { Resolution } from "../shared/enums/resolution.enum";
import { CreateMeasurementDto } from "./dto/create-measurement.dto";
import {
    GetMeasurementsParamsDto,
    GetMeasurementsQueryDto,
    MeasurementsOutputDto,
} from "./dto/get-measurements.dto";
import { MeasurementService } from "./measurement.service";

@ApiTags("measurements")
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
    @ApiResponse({
        status: 200,
        description: "Medições retornadas com sucesso",
        type: MeasurementsOutputDto,
    })
    @ApiResponse({ status: 400, description: "Erro ao buscar medições" })
    @ApiResponse({ status: 500, description: "Erro interno" })
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
    @ApiResponse({
        status: 201,
        description: "Medições salvas com sucesso",
        type: [Measurement],
    })
    @ApiResponse({ status: 400, description: "Erro ao salvar medições" })
    @ApiResponse({ status: 500, description: "Erro interno" })
    @ApiBody({
        type: [CreateMeasurementDto],
        description: "Lista de medições a serem salvas",
    })
    saveMeasurement(@Body() measurements: CreateMeasurementDto[]) {
        return this.measurementService.saveMeasurements(measurements);
    }
}
