import { IsDateString, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateMeasurementDto {
    @IsString()
    @IsNotEmpty()
    idDispositivo: string;

    @IsNotEmpty()
    @IsDateString()
    timestamp: string;

    @IsNotEmpty()
    @IsNumber()
    activeEnergy: number;

    @IsNotEmpty()
    @IsNumber()
    activePower: number;
}
