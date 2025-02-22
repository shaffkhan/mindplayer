import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { PreferencesService } from './preferences.service';

import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdatePreferencesDto } from './dto/update-preference.dto';

@ApiTags('User Preferences')
@Controller('preferences')
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiResponse({ status: 200, description: 'User preferences retrieved successfully.' })
  async getPreferences(@Request() req) {
    return this.preferencesService.getPreferences(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  @ApiResponse({ status: 200, description: 'User preferences updated successfully.' })
  async updatePreferences(@Request() req, @Body() updateDto: UpdatePreferencesDto) {
    return this.preferencesService.updatePreferences(req.user.id, updateDto);
  }
}
