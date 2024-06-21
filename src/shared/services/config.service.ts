import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import * as env from 'dotenv'

env.config()

export class ConfigService {
    public getEnv(key: string): any {
        return process.env[key]
    }

    public getTypeOrmConfig(): TypeOrmModuleOptions {        
        return {
            type: 'mysql',
            host: this.getEnv('DATABASE_HOST'),
            database: this.getEnv('DATABASE_NAME'),
            username: this.getEnv('DATABASE_USERNAME'),
            password: this.getEnv('DATABASE_PASSWORD'),
            port: Number(this.getEnv('DATABASE_EXTERNAL_PORT')),
            synchronize: true,
            entities: [],
            ssl: false,
        }
    }
}

export const configService = new ConfigService()