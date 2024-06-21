import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeasurementModule } from './measurement/measurement.module';
import { configService } from './shared/services/config.service';

@Module({
  imports: [TypeOrmModule.forRoot(configService.getTypeOrmConfig()), MeasurementModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
