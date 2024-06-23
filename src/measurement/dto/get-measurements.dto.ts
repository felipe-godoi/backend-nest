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
    @IsNotEmpty()
    @IsString()
    deviceId: string;
}

export class GetMeasurementsQueryDto {
    @IsOptional()
    @IsEnum(Resolution)
    resolution: Resolution;

    @IsNotEmpty()
    @IsISO8601()
    @Transform(({ value }) => new Date(value).toISOString())
    startDate: string;

    @IsNotEmpty()
    @IsISO8601()
    @Transform(({ value }) => new Date(value).toISOString())
    endDate: string;
}
