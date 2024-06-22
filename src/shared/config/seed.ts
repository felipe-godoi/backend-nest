import { DataSource } from "typeorm";
import { configService } from "../services/config.service";
import { runSeeders } from "typeorm-extension";

const dataSource = new DataSource(configService.getTypeOrmSeedConfig());

dataSource.initialize().then(async () => {
    await runSeeders(dataSource);

    process.exit();
});