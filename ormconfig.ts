import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  url: "postgres://mindplayer_user:shaff@127.0.0.1:5432/mindplayer",
  schema: "mindplayer", // Explicitly set the schema to "mindplayer"
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/src/migrations/*.js'],
  synchronize: false,
  migrationsTableName: 'migration',
  extra: {
    ssl: false,
  },
});

export default AppDataSource;
