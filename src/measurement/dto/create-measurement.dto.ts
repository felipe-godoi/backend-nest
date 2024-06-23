import { Transform } from "class-transformer";
import { IsISO8601, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateMeasurementDto {
    @IsString()
    @IsNotEmpty()
    idDispositivo: string;

    @IsNotEmpty()
    @IsISO8601()
    @Transform(({ value }) => new Date(value).toISOString())
    timestamp: string;

    @IsNotEmpty()
    @IsNumber()
    activeEnergy: number;

    @IsNotEmpty()
    @IsNumber()
    activePower: number;
}
