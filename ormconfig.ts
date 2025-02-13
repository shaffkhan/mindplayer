import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: ['src/**/*.entity.js'],
  migrations: ['/src/migrations/*.ta'],
  synchronize: false,
  migrationsTableName: 'migration',
  extra: {
    ssl: false, // Disable SSL explicitly
  },
});

export default AppDataSource;
