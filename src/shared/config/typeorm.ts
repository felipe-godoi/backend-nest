import "reflect-metadata";
import { DataSource } from "typeorm";
import { configService } from "../services/config.service";

const dataSource = new DataSource(configService.getTypeOrmConfig());

export default dataSource;
