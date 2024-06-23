import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MeasurementModule } from "./measurement/measurement.module";
import { configService } from "./shared/services/config.service";

@Module({
    imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        MeasurementModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
