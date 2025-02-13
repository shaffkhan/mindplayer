import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private configService: NestConfigService) {}

  get<T>(key: string, defaultValue?: T): T| undefined {
    const value = this.configService.get<T>(key);
    console.log(`Loaded value for ${key}:`, value); // Logs the value
    if (value === undefined && defaultValue === undefined) {
      throw new Error(`Environment variable ${key} is missing.`);
    }
    return value ?? defaultValue;
  }
  //asdasd
}
