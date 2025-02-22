import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPreference } from './entities/preference.entity';
import { UpdatePreferencesDto } from './dto/update-preference.dto';


@Injectable()
export class PreferencesService {
  constructor(
    @InjectRepository(UserPreference)
    private preferenceRepository: Repository<UserPreference>,
  ) {}

  async getPreferences(userId: string): Promise<UserPreference> {
    const preferences = await this.preferenceRepository.findOne({ where: { user: { id: userId } } });
    if (!preferences) {
      throw new NotFoundException('Preferences not found for this user');
    }
    return preferences;
  }

  async updatePreferences(userId: string, updateDto: UpdatePreferencesDto): Promise<UserPreference> {
    const preferences = await this.preferenceRepository.findOne({ where: { user: { id: userId } } });
    if (!preferences) {
      throw new NotFoundException('Preferences not found for this user');
    }
    const updated = this.preferenceRepository.merge(preferences, updateDto);
    return this.preferenceRepository.save(updated);
  }
}
