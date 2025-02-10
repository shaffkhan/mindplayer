// src/config/custom-config.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config'; // Rename the imported module
import * as path from 'path';

@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: path.resolve(__dirname, '.env'),  // Load .env file from root
      isGlobal: true,  // Makes ConfigModule available globally
    }),
  ],
})
export class CustomConfigModule {} // Rename the custom ConfigModule
