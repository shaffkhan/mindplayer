import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  OneToOne,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
// Use a relative path instead of an absolute one:
import { UserPreference } from '../../preferences/entities/preference.entity';

@Entity('User')
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ type: 'integer', nullable: true })
  emailOtp: number | null;

  @Column({ type: 'integer', nullable: true })
  resetOtp: number | null;

  @Column({ default: 'male' })
  gender: string;

  @Column({ type: 'date', default: () => "'2000-01-01'" })
  dob: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => UserPreference, (preference) => preference.user, { cascade: true, eager: true })
  preferences: UserPreference;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async validatePassword(plainPassword: string): Promise<boolean> {
    if (!plainPassword || !this.password) {
      throw new Error('Invalid credentials');
    }
    return bcrypt.compare(plainPassword, this.password);
  }
}
