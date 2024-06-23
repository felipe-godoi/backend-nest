import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Measurement {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column({ name: "id-dispositivo", type: "varchar", nullable: false })
    idDispositivo: string;

    @ApiProperty()
    @Column("datetime")
    timestamp: Date;

    @ApiProperty()
    @Column("integer")
    activeEnergy: number;

    @ApiProperty()
    @Column("integer")
    activePower: number;
}
