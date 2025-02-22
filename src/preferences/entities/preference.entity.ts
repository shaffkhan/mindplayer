import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../auth/entities/auth.entity';

@Entity('user_preferences')
export class UserPreference {
  @PrimaryGeneratedColumn()
  id: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  // Areas of focus stored as JSON
  @Column({ type: 'json', nullable: true })
  areas_of_focus: Record<string, any>;

  // Interests and goals stored as JSON
  @Column({ type: 'json', nullable: true })
  interests_and_goals: Record<string, any>;
}
