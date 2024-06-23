import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsISO8601, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateMeasurementDto {
    @ApiProperty({
        example: "mymeter-uid",
        required: true,
        description: "Id do dispositivo",
    })
    @IsString()
    @IsNotEmpty()
    idDispositivo: string;

    @ApiProperty({
        example: "2024-01-01 00:00:00+00",
        required: true,
        description: "Data da medição",
    })
    @IsNotEmpty()
    @IsISO8601()
    @Transform(({ value }) => new Date(value).toISOString())
    timestamp: string;

    @ApiProperty({ example: 100, required: true, description: "Energia ativa" })
    @IsNotEmpty()
    @IsNumber()
    activeEnergy: number;

    @ApiProperty({
        example: 100,
        required: true,
        description: "Potência ativa",
    })
    @IsNotEmpty()
    @IsNumber()
    activePower: number;
}
