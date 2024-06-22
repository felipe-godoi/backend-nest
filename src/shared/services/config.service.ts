import "reflect-metadata";
import * as env from 'dotenv'
import { Measurement } from '../entities/measurement.entity'
import { DataSourceOptions } from "typeorm";
import { SeederOptions } from "typeorm-extension";

env.config()

export class ConfigService {
    public getEnv(key: string): any {
        return process.env[key]
    }

    public getTypeOrmConfig(): DataSourceOptions {        
        return {
            type: 'mysql',
            host: this.getEnv('DATABASE_HOST'),
            database: this.getEnv('DATABASE_NAME'),
            username: this.getEnv('DATABASE_USERNAME'),
            password: this.getEnv('DATABASE_PASSWORD'),
            port: Number(this.getEnv('DATABASE_EXTERNAL_PORT')),
            synchronize: false,
            ssl: false,
            entities: [Measurement],
            migrations: ['dist/migrations/*-migration.js'],
            migrationsTableName: "migrations"
        }
    }

    public getTypeOrmSeedConfig(): DataSourceOptions & SeederOptions {
        return {
            ...this.getTypeOrmConfig(),
            seeds: ["seeds/**/*{.ts,.js}"]
        }
    }
}

export const configService = new ConfigService()