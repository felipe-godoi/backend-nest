import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1719027346701 implements MigrationInterface {
    name = 'Migration1719027346701'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`measurement\` (\`id\` int NOT NULL AUTO_INCREMENT, \`id-dispositivo\` varchar(255) NOT NULL, \`timestamp\` datetime NOT NULL, \`activeEnergy\` int NOT NULL, \`activePower\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`measurement\``);
    }

}
