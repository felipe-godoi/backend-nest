import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Measurement {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "id-dispositivo", type: "varchar", nullable: false })
    idDispositivo: string;

    @Column("datetime")
    timestamp: Date;

    @Column("integer")
    activeEnergy: number;
    
    @Column("integer")
    activePower: number;
}
