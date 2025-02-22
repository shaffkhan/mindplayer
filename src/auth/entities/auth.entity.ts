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
import { UserPreference } from 'src/preferences/entities/preference.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  email: string;

  // Exclude password from default queries
  @Column({ select: false })
  password: string;

  // Email verification flag
  @Column({ default: false })
  emailVerified: boolean;

  // OTP for email verification; allow null
  @Column({ type: 'integer', nullable: true })
  emailOtp: number | null;

  // OTP for password reset; allow null
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

  // One-to-one relation with user preferences
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
