import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  url: "postgres://mindplayer_user:shaff@127.0.0.1:5432/mindplayer",
  // If you are using a custom schema, e.g., "mindplayer", uncomment the next line:
  // schema: "mindplayer",
  entities: ['src/**/*.entity.ts'], // Use TS files for migration generation
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  migrationsTableName: 'migration',
  extra: {
    ssl: false,
  },
});

export default AppDataSource;
