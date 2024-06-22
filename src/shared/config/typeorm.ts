import "reflect-metadata";
import { DataSource, DataSourceOptions } from 'typeorm';
import { configService } from '../services/config.service';

const dataSource = new DataSource(configService.getTypeOrmConfig() as DataSourceOptions);

export default dataSource;