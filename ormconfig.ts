import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  url: "postgres://mindplayer_user:shaff@127.0.0.1:5432/mindplayer",
  schema: "mindplayer", // if you're using a custom schema
  entities: ['src/**/*.entity.ts'],  // Use TS files for migration generation
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  migrationsTableName: 'migration',
  extra: {
    ssl: false,
  },
});

export default AppDataSource;
