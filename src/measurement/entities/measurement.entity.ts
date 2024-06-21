import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Measurement {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "number", nullable: false })
    idDispositivo: number;

    @Column("datetime")
    timestamp: Date;

    @Column("integer")
    activeEnergy: number;
    
    @Column("integer")
    activePower: number;
}
