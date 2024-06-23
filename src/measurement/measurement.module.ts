import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MeasurementRepository } from "../shared/repositories/measurement.repository";
import { MeasurementController } from "./measurement.controller";
import { MeasurementService } from "./measurement.service";

@Module({
    imports: [TypeOrmModule.forFeature([MeasurementRepository])],
    controllers: [MeasurementController],
    providers: [MeasurementService, MeasurementRepository],
})
export class MeasurementModule {}
