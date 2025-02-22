import { Module } from '@nestjs/common';
import { PreferencesService } from './preferences.service';
import { PreferencesController } from './preferences.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPreference } from './entities/preference.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserPreference])],
  controllers: [PreferencesController],
  providers: [PreferencesService],
  exports: [PreferencesService],
})
export class PreferencesModule {}
