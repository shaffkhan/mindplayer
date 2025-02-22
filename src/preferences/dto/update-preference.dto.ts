import { IsOptional, IsObject } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePreferencesDto {
  @ApiPropertyOptional({ description: 'Areas of focus as a JSON object' })
  @IsOptional()
  @IsObject()
  areas_of_focus?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Interests and goals as a JSON object' })
  @IsOptional()
  @IsObject()
  interests_and_goals?: Record<string, any>;
}
