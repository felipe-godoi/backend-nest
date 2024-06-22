import { Measurement } from "../../src/shared/entities/measurement.entity";
import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import * as fs from 'fs'

export default class MeasurementSeeder implements Seeder {
    track = true;

    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager
    ): Promise<any> {
        const measurementRepository = dataSource.getRepository(Measurement);

        const rawdata = fs.readFileSync('./data/dados-medicao-demo.json', 'utf8');
        const data = JSON.parse(rawdata);

        const measurements = data.map((m) => {
            const measurement = new Measurement();
            measurement.activeEnergy = m.activeEnergy;
            measurement.activePower = m.activePower;
            measurement.idDispositivo = m["id-dispositivo"];
            measurement.timestamp = m.timestamp;

            return measurement
        })

        await measurementRepository.save(measurements);
    }
 }