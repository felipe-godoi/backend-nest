import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
    IsEnum,
    IsISO8601,
    IsNotEmpty,
    IsOptional,
    IsString,
} from "class-validator";
import { Resolution } from "../../shared/enums/resolution.enum";

export class GetMeasurementsParamsDto {
    @ApiProperty({
        example: "mymeter-uid",
        required: true,
        description: "Id do dispositivo",
    })
    @IsNotEmpty()
    @IsString()
    deviceId: string;
}

export class GetMeasurementsQueryDto {
    @ApiProperty({
        example: "day",
        required: false,
        description: "Resolução da agregação das medições",
        enum: Resolution,
    })
    @IsOptional()
    @IsEnum(Resolution)
    resolution: Resolution;

    @ApiProperty({
        example: "2022-06-01 00:00:00+00",
        required: true,
        description: "Data de início da consulta",
    })
    @IsNotEmpty()
    @IsISO8601()
    @Transform(({ value }) => new Date(value).toISOString())
    startDate: string;

    @ApiProperty({
        example: "2022-06-01 23:59:59+00",
        required: true,
        description: "Data de fim da consulta",
    })
    @IsNotEmpty()
    @IsISO8601()
    @Transform(({ value }) => new Date(value).toISOString())
    endDate: string;
}

export class MeasurementOutputDto {
    @ApiProperty()
    date: string;

    @ApiProperty()
    activeEnergy?: number;

    @ApiProperty()
    activePower?: number;

    @ApiProperty({ description: "Energia acumulada de acordo com a resolução" })
    accumulatedEnergy?: number;

    @ApiProperty({
        description: "Potência acumulada de acordo com a resolução",
    })
    accumulatedPower?: number;
}

export class MeasurementsOutputDto {
    @ApiProperty({ type: [MeasurementOutputDto] })
    measurements: MeasurementOutputDto[];
}
